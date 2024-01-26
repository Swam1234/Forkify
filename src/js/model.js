import { API_KEY, API_URL, RES_PER_PAGE } from "./config.js";
import { postRequest, sendRequest } from "./helper.js";

export const state = {
 recipe: {},
 search: {
  query: '',
  result: [],
  resultsPerPage: RES_PER_PAGE,
  curPage: 1,
  totalPage: undefined,
 },
 bookmarks: [],
}

const createFormatedRecipe = function (data) {
 const { recipe } = data.data;
 return {
  title: recipe.title,
  publisher: recipe.publisher,
  ingredients: recipe.ingredients,
  image: recipe.image_url,
  servings: recipe.servings,
  time: recipe.cooking_time,
  sourceUrl: recipe.source_url,
  id: recipe.id,
  ...(recipe.key && { key: recipe.key })
 };
}

export const loadRecipe = async function (url) {
 try {
  const data = await sendRequest(`${url}?key=${API_KEY}`);
  state.recipe = createFormatedRecipe(data);
  state.recipe.isBookmarked = state.bookmarks.some(bookmark => bookmark.id === state.recipe.id);
 } catch (error) {
  console.log(error);
  throw error;
 }
};

export const loadSearchResult = async function (query) {
 try {
  state.search.query = query;
  const data = await sendRequest(`${API_URL}?search=${query}&key=${API_KEY}`);
  if (!data.data.recipes.length) throw new Error('No Recipe is found for your search');
  state.search.result = data.data.recipes.map(recipe => {
   return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image_url,
    publisher: recipe.publisher
   }
  });
 } catch (error) {
  console.log(error);
  throw error
 }
}

export const loadResultsPerPage = function (page) {
 state.search.curPage = page;
 state.search.totalPage = Math.ceil(state.search.result.length / state.search.resultsPerPage);

 const start = (page - 1) * state.search.resultsPerPage;
 const end = page * state.search.resultsPerPage;

 return state.search.result.slice(start, end);
}

export const updateRecipeState = function (updatedServing) {
 const newServing = updatedServing;
 state.recipe.ingredients.forEach(ing => {
  ing.quantity = (newServing / state.recipe.servings) * ing.quantity;
 })
 state.recipe.servings = newServing;
}

export const addBookmark = function (bookmarkedRecipe) {
 state.recipe.isBookmarked = true;
 state.bookmarks.push(bookmarkedRecipe);
}

export const removeBookmark = function (id) {
 state.recipe.isBookmarked = false;
 state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== id)
}

export const addBookmarkToLocalStorage = function () {
 localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const getBookmarkFromLocalStorage = function () {
 const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
 if (!bookmarks || !bookmarks.length) return;
 state.bookmarks = bookmarks
}

export const uploadNewRecipe = async function (newRecipe) {
 try {
  const uploadRecipe = {
   title: newRecipe.title,
   publisher: newRecipe.publisher,
   image_url: newRecipe.image,
   servings: +newRecipe.servings,
   cooking_time: newRecipe.cookingTime,
   source_url: newRecipe.sourceUrl,
  }

  uploadRecipe.ingredients = Object.entries(newRecipe)
   .filter(([key, value]) => key.startsWith('ing') && value !== "")
   .map(([, ing]) => {
    const ingEntrie = ing.split(',');
    if (ingEntrie.length !== 3) throw new Error('Invalid Ingredient Input. Please use the correct form of ingredients');
    const [quantity, unit, description] = ingEntrie;
    return { quantity: quantity ? +quantity : null, unit, description };
   });

  const data = await postRequest(`${API_URL}?key=${API_KEY}`, uploadRecipe);
  state.recipe = createFormatedRecipe(data);
  addBookmark(state.recipe);
  addBookmarkToLocalStorage();
 } catch (error) {
  console.log(error);
  throw error;
 }
}

console.log("Hello Worldddd");