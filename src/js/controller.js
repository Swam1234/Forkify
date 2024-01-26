import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import { API_URL } from './config.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addBookmarkView from './views/addBookmarkView.js';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////


const controllRecipe = async function () {
  try {

    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    await model.loadRecipe(`${API_URL}${id}`);

    recipeView.render(model.state.recipe);

    resultView.update(model.loadResultsPerPage(model.state.search.curPage));

    bookmarkView.update(model.state.bookmarks);

  } catch (error) {
    console.warn(error.message)
    recipeView.renderError();
  }
}

const controllSearchResult = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();
    await model.loadSearchResult(query);
    resultView.render(model.loadResultsPerPage(1));
    paginationView.render(model.state.search);
  } catch (error) {
    console.warn(error.message);
    resultView.renderError();
  }
}

const controllPagination = function (page) {
  resultView.render(model.loadResultsPerPage(page));
  paginationView.render(model.state.search);
}

const controlUpdateServing = function (updatedServing) {
  model.updateRecipeState(updatedServing);
  recipeView.update(model.state.recipe)
}

const controlBookmark = function () {
  try {
    if (model.state.recipe.isBookmarked) model.removeBookmark(model.state.recipe.id)
    else model.addBookmark(model.state.recipe);
    recipeView.update(model.state.recipe)
    model.addBookmarkToLocalStorage();
    if (!model.state.bookmarks.length) throw new Error('NO bookmarks yet!');
    bookmarkView.render(model.state.bookmarks);
  } catch (error) {
    bookmarkView.renderError();
  }
}

const controlBookmarkLoading = function () {
  model.getBookmarkFromLocalStorage();
  if (!model.state.bookmarks.length) return;
  bookmarkView.render(model.state.bookmarks);
}

const controlAddNewRecipe = async function (newRecipe) {
  try {
    addBookmarkView.renderSpinner();
    await model.uploadNewRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);
    addBookmarkView.renderMessage();
    history.pushState(null, '', `#${model.state.recipe.id}`)
    setTimeout(addBookmarkView.toggleForm.bind(addBookmarkView), 2000);
  } catch (error) {
    console.warn(error);
    addBookmarkView.renderError(error.message);
  }
}

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarkLoading)
  recipeView.addHandlerRender(controllRecipe);
  searchView.addHandlerEvent(controllSearchResult);
  paginationView.addHandlerRender(controllPagination);
  recipeView.addUpdateServingHandler(controlUpdateServing);
  recipeView.addBookmarkHandler(controlBookmark);
  addBookmarkView.addSubmitHandler(controlAddNewRecipe);
}

init();
