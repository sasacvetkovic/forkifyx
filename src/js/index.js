import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, cleanLoader} from './views/base'
const state = {};

// SEARCH CONTROLER
const controlSearch = async () => {
    //1. Get query from view
    const query = searchView.getInput();
    if(query){
    //2. New search object and add to state
    state.search = new Search(query);
    //3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes)
    //4. Search for recipes
    try {
        await state.search.getResults();

        //5. Render results on UI
        cleanLoader();
        searchView.renderResults(state.search.result);
    } catch(err) {
        alert('Something went wron with the search');
        cleanLoader();
    } 
    }

};

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
    const btn = e.target.closest('.btn-inline')
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);

    }
});


// RECEPIE CONTROLER

const controlRecipe = async () => {
    
    const id = window.location.hash.replace("#", "") 
    console.log(id);

    if(id){
        // Prepare UI for changes

        // Create new recipe object
        state.recipe = new Recipe(id);
        try{
            // Get recipe data
            await state.recipe.getRecipe();
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // Render recipe
            console.log(state.recipe)
        }catch (err){
            alert('Error processing recipe')
        }
    }
}

window.addEventListener("hashchange", controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));