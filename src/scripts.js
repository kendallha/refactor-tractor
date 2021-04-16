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



window.addEventListener("load", loadDataFromAPI);
allRecipesBtn.addEventListener("click", () => {
   domUpdates.showAllRecipes(recipes);
});
filterBtn.addEventListener("click", findCheckedBoxes);
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
  
  createCards();
  findTags();
  generateUser();
}

//FETCH DATA FROM API
function loadDataFromAPI() {
  const usersPromise = fetch("http://localhost:3001/api/v1/users")
    .then(response => response.json())
    .then(data => users = data)
    .catch(error => console.log(error));

  const recipesPromise = fetch("http://localhost:3001/api/v1/recipes")
    .then(response => response.json())
    .then(data => recipeData = data)
    .catch(error => console.log(error));

  const ingredientsPromise = fetch("http://localhost:3001/api/v1/ingredients")
    .then(response => response.json())
    .then(data => ingredientsData = data)
    .catch(error => console.log(error));

  Promise.all([usersPromise, recipesPromise, ingredientsPromise])
    .then(data => loadDOM(data))
    .catch(error => console.log(error));
}

// GENERATE A USER ON LOAD
function generateUser() {
  user = new User(users[Math.floor(Math.random() * users.length)]);
  domUpdates.displayUser(user);
  findPantryInfo();
}

// POST FETCH REQUEST
function changePantryIngredientAmount(userId, ingredientId, ingredientAmount) {
  fetch("http://localhost:3001/api/v1/users", {
    method: "POST",
    body: JSON.stringify({
      userID: userId,
      ingredientID: ingredientId,
      ingredientModification: ingredientAmount
    }),
    headers: {
   'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}

// CREATE RECIPE CARDS
function createCards() {
  recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    let shortRecipeName = recipeInfo.name;
    recipes.push(recipeInfo);
    if (recipeInfo.name.length > 40) {
      shortRecipeName = recipeInfo.name.substring(0, 40) + "...";
    }
    domUpdates.addToDom(recipeInfo, shortRecipeName, main)
  });
}

// FILTER BY RECIPE TAGS
function findTags() {
  let tags = [];
  recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  tags.sort();
  domUpdates.listTags(tags, tagList);
}

function findCheckedBoxes() {
  let tagCheckboxes = document.querySelectorAll(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  })
  findTaggedRecipes(selectedTags);
}

function findTaggedRecipes(selected) {
  let filteredResults = [];
  selected.forEach(tag => {
    let allRecipes = recipes.filter(recipe => {
      return recipe.tags.includes(tag.id);
    });
    allRecipes.forEach(recipe => {
      if (!filteredResults.includes(recipe)) {
        filteredResults.push(recipe);
      }
    })
  });

  domUpdates.showAllRecipes(recipes);
  if (filteredResults.length > 0) {
    filterRecipes(filteredResults);
  }
}

function filterRecipes(filtered) {
  let foundRecipes = recipes.filter(recipe => {
    return !filtered.includes(recipe);
  });
  domUpdates.hideUnselectedRecipes(foundRecipes)
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
  let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));
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
