export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    recipeResList: document.querySelector('.results__list'),
    recipeListArea: document.querySelector('.results'),
    recipeResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    recipeLoveBtn: document.querySelector('.recipe__love'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader',
    newLoader: 'loader-test'
};


export const renderLoader = parent => {

    const loader = `
        <div class='${elementStrings.newLoader}'></div>
    `;

//   const loader = `
//         <div class='${elementStrings.loader}'>
//             <svg>
//                 <use href="img/icons.svg#icon-cw"></use>
//             </svg>
//         </div>
//   `;  
  parent.insertAdjacentHTML('afterbegin', loader);
};


export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.newLoader}`);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
};