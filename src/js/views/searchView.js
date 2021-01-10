import { elements } from './base'

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.recipeResList.innerHTML = '';
    elements.recipeResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(cur => {
        cur.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};


export const limitRecipeTitle = (title, limit = 17) => {
    const titleRes = [];

    if(title.length > limit) {

        const splitTitle = title.split(' ');
        //console.log(splitTitle);
        splitTitle.reduce((acc, cur) => {
            //console.log(`Acc value: ${acc} and splitArr: ${titleRes}`);
            if((acc + cur.length) <= limit) {
                titleRes.push(cur);
            }
            return acc + cur.length;
        }, 0);

        //Return the result
        return `${titleRes.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
   const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
   ` 
   elements.recipeResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `;

const renderButtons = (page, numRes, resPerPage) => {
    const pages = Math.ceil(numRes / resPerPage);

    let button;
    if(page === 1 && pages > 1) {
        // only Button to go to the next page
        button = createButton(page, 'next');
    } else if(page < pages) {
        // Both the pages
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `
    } else if(page === pages && pages > 1) {
        // only Button to go to the prev page
        button = createButton(page, 'prev');
    }
    elements.recipeResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
};