import './css/base.scss';
import './css/styles.scss';
import domUpdates from './dom-updates';
import User from './user';
import Recipe from './recipe';
import RecipeRepository from './recipe-repository';

let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector(".filter-btn");
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let main = document.querySelector("main");
let menuOpen = false;
let pantryBtn = document.querySelector(".my-pantry-btn");
let pantryInfo = [];
let recipes = [];
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let searchBtn = document.querySelector(".search-btn");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");
let showPantryRecipes = document.querySelector(".show-pantry-recipes-btn");
let tagList = document.querySelector(".tag-list");
let user;
let users;
let recipeData;
let ingredientsData;
let recipeRepo;

window.addEventListener("load", loadDataFromAPI);
allRecipesBtn.addEventListener("click", () => {
   domUpdates.showAllRecipes(recipes);
});
filterBtn.addEventListener("click", showFilteredRecipes);
main.addEventListener("click", addToMyRecipes);
pantryBtn.addEventListener("click", () => {
  domUpdates.toggleMenu(menuOpen);
  menuOpen = !menuOpen;
});
savedRecipesBtn.addEventListener("click", () => {
  domUpdates.showSavedRecipes(recipes, user);
});
searchBtn.addEventListener("click", searchRecipes);
showPantryRecipes.addEventListener("click", findCheckedPantryBoxes);
searchForm.addEventListener("submit", pressEnterSearch);

//ON LOAD HELPER FUNCTION
function loadDOM([users, recipes, ingredients]) {
  recipeRepo = new RecipeRepository(recipes);
  ingredientsData = ingredients;
  domUpdates.createCards(recipeRepo, main);
  domUpdates.displayTags(recipeRepo, tagList);
  generateUser(users);
}

//FETCH DATA FROM API
function loadDataFromAPI() {
  const usersPromise = fetch("http://localhost:3001/api/v1/users")
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error));

  const recipesPromise = fetch("http://localhost:3001/api/v1/recipes")
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error));

  const ingredientsPromise = fetch("http://localhost:3001/api/v1/ingredients")
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error));

  Promise.all([usersPromise, recipesPromise, ingredientsPromise])
    .then(data => loadDOM(data))
    .catch(error => console.log(error));
}

// GENERATE A USER ON LOAD
function generateUser(users) {
  user = new User(users[Math.floor(Math.random() * users.length)]);
  domUpdates.displayUser(user);
  findPantryInfo();
}

// FILTER BY RECIPE TAGS

function findCheckedBoxes() {
  domUpdates.createCards(recipeRepo, main);
  let selectedTags = [];
  let tagCheckboxes = document.querySelectorAll(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes);
  checkboxInfo.forEach(box => {
    if (box.checked) {
    selectedTags.push(box.id);
    }
  })
  return selectedTags;
}

function showFilteredRecipes() {
  domUpdates.createCards(recipeRepo, main);
  let selectedTags = findCheckedBoxes();
  const selectedRecipes = recipeRepo.filterRecipesByTag(selectedTags);
  recipeRepo.recipes.forEach(recipe => {
    if (selectedRecipes.length > 0 && !selectedRecipes.includes(recipe)) {
      domUpdates.hideUnselectedRecipes(recipe);
    }
  })
}



// FAVORITE RECIPE FUNCTIONALITY
function addToMyRecipes() {
  if (event.target.className === "card-apple-icon") {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    if (!user.favoriteRecipes.includes(cardId)) {
      event.target.src = "../images/apple-logo.png";
      user.saveRecipe(cardId);
    } else {
      event.target.src = "../images/apple-logo-outline.png";
      user.removeRecipe(cardId);
    }
  } else if (event.target.id === "exit-recipe-btn") {
    domUpdates.exitRecipe(fullRecipeInfo);
  } else if (domUpdates.isDescendant(event.target.closest(".recipe-card"), event.target)) {
    openRecipeInfo(event);
  }
}

// CREATE RECIPE INSTRUCTIONS
function openRecipeInfo(event) {
  fullRecipeInfo.style.display = "inline";
  let recipeId = event.path.find(e => e.id).id;
  let recipe = recipeRepo.recipes.find(recipe => recipe.id === Number(recipeId));
  console.log(recipe);
  domUpdates.generateRecipeTitle(recipe, generateIngredients(recipe), fullRecipeInfo);
  domUpdates.addRecipeImage(recipe);
  domUpdates.displayRecipeInstructions(recipe, fullRecipeInfo);
  domUpdates.displayRecipeInfo(fullRecipeInfo);
}

function generateIngredients(recipe) {
  return recipe && recipe.ingredients.map(i => {
    return `${i.name} (${i.quantity.amount} ${i.quantity.unit})`
  }).join(", ");
}

// SEARCH RECIPES
function pressEnterSearch(event) {
  event.preventDefault();
  searchRecipes();
}

function searchRecipes() {
  domUpdates.showAllRecipes(recipes);
  let searchedRecipes = recipeData.filter(recipe => {
    return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  filterNonSearched(createRecipeObject(searchedRecipes));
}

function filterNonSearched(filtered) {
  let found = recipes.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id)
  })
  hideUnselectedRecipes(found);
}

function createRecipeObject(recipes) {
  recipes = recipes.map(recipe => new Recipe(recipe));
  return recipes
}

// CREATE AND USE PANTRY
function findPantryInfo() {
  user.pantry.pantryIngredients.forEach(item => {
    let itemInfo = ingredientsData.find(ingredient => {
      return ingredient.id === item.ingredient;
    });
    let originalIngredient = pantryInfo.find(ingredient => {
      if (itemInfo) {
        return ingredient.name === itemInfo.name;
      }
    });
    if (itemInfo && originalIngredient) {
      originalIngredient.count += item.amount;
    } else if (itemInfo) {
      pantryInfo.push({name: itemInfo.name, count: item.amount});
    }
  });
  domUpdates.displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
}

function findCheckedPantryBoxes() {
  let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
  let pantryCheckboxInfo = Array.from(pantryCheckboxes)
  let selectedIngredients = pantryCheckboxInfo.filter(box => {
    return box.checked;
  })
  domUpdates.showAllRecipes(recipes);
  if (selectedIngredients.length > 0) {
    findRecipesWithCheckedIngredients(selectedIngredients);
  }
}

function findRecipesWithCheckedIngredients(selected) {
  let recipeChecker = (arr, target) => target.every(v => arr.includes(v));
  let ingredientNames = selected.map(item => {
    return item.id;
  })
  recipes.forEach(recipe => {
    let allRecipeIngredients = [];
    recipe.ingredients.forEach(ingredient => {
      allRecipeIngredients.push(ingredient.name);
    });
    if (!recipeChecker(allRecipeIngredients, ingredientNames)) {
      domUpdates.hideRecipes(recipe.id);
    }
  })
}
