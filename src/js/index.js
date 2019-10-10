import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';



/* Global state of the app
|* - Search object
|* - Current recipe object
|* - Shopping list object
|* - Like recipes
|*/
const state = {};


/*
*SEARCH CONTROLLER
*/
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();
    // console.log(query);

    if ( query ) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();

        renderLoader(elements.searchRes);

        try{
            // 4) Search for recipes
            await state.search.getResults();

            // 5) render results on UI
            // console.log(state.search.result);
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error){
            console.log(error);
            alert('Error search!');
            clearLoader();
        }
       
    }
};


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});

elements.searchResPages.addEventListener('click', e => {
    // console.log(e.target);
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/*
*RECIPE CONTROLLER
*/
// const r = new Recipe(47746);
// r.getRecipe();
// console.log(r);
const controlRecipe = async () => {
    //het id from URL
    const id = window.location.hash.replace('#', '');

    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //Create new recipe object

        if (state.search) searchView.highlightSelected(id);

        state.recipe = new Recipe(id);

        try{
            // Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (error) {
            console.log(error);
            alert('Error recipe id');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//Add event on btn +/-
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    // console.log(state.recipe);
});

window.l = new List();
