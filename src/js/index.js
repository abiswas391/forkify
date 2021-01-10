import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/* the global state of the app* 
    **Search object
    **Current recipe object
    **Shopping list object
    **Liked recipe
*/

 const state = {};


/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // Get the query from view
    const query = searchView.getInput();
    console.log(query);

    if(query) {
        // New search object and add it to state
        state.search = new Search(query);

        // Prepare UI for the result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.recipeListArea);
        //search for recipe
        try {
            await state.search.getResults();
    
            // Render result to the UI
            searchView.renderResults(state.search.result);
            //console.log(state.search.result);
            clearLoader();
        } catch(error) {
            console.log('Something wrong with the search');
            clearLoader();
        }
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});    


elements.recipeResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});



/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    //Get id from the URL
    const id = window.location.hash.replace('#', '');
    //console.log(id);

    if(id) {
        // Prepare UI for changes
        recipeView.removeRecipe();
        renderLoader(elements.recipe);

        //highlight selected
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        // Get Recipe data and parse ingredients
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //console.log(state.recipe);
    
            // CAlculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render Recipe
            clearLoader();

            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        } catch (error) {
            console.log(error);
        }

    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * List CONTROLLER
 */
const controlList = () => {
    // Create a new list if there is none yet
    if(!state.list) state.list = new List();

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};


// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update    
    } else if (e.target.matches('.shopping__count--value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});



/**
 * LIKES CONTROLLER
 */
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    // User has NOT yet liked the current recipe
    if(state.likes.isLiked(currentId)) {
        // Add like to the state
        const currentLike = state.likes.addLike(
            currentId, 
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
            );

        // Toggle the like button
        likesView.toggleLikeButton(true);

        // Add like to the UI list
        likesView.renderLike(currentLike);


    // User HAS liked the current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentId);

        // Toggle the like button
        likesView.toggleLikeButton(false);

        // Remove like from the UI list
        likesView.deleteLike(currentId);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Persist data and read the data from the local storage on page load
window.addEventListener('load', () => {
    // Create  alike object
    state.likes = new Likes();

    // Read the data from the local storage
    state.likes.readStorage();

    // Toggle the like button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Handle recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if(state.recipe.servings > 1) {
            //update servings
            state.recipe.updateServings('dec');

            // Update count
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked // Update servings
        state.recipe.updateServings('inc');
        
        //update count
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__button--add, .recipe__button--add *')) {
        // Add ingredients to the shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});
