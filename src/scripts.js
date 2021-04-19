import './css/styles.scss';
import './index.js';
import domUpdates from './dom-updates';
import User from './user';
import RecipeRepository from './recipe-repository';

let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector(".filter-btn");
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let main = document.querySelector("main");
let pantrySection = document.querySelector(".pantry-list");
let menuOpen = false;
let pantryBtn = document.querySelector(".my-pantry-btn");
let pantryInfo = [];
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let cookListButton = document.querySelector("#cookButton");
let searchBtn = document.querySelector(".search-btn");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");
let showPantryRecipes = document.querySelector(".show-pantry-recipes-btn");
let tagList = document.querySelector(".tag-list");
let cookMealButton = document.querySelector("#cookMeal")
let cookButtonWrapper = document.querySelector("#mealButtonWrapper")
let removeFromPantryButton = document.querySelector("#removeFromPantry")
let pantryIngredientInput = document.querySelector("#addIngredient")
let pantryIngredientAmountInput = document.querySelector("#addAmount")
let addToPantryButton = document.querySelector("#addToPantry")
let user;
let ingredientsData;
let recipeRepo;

window.addEventListener("load", loadDataFromAPI);
fullRecipeInfo.addEventListener("click", (e) => {
  if (e.target.id === "addToList") {
    addRecipeToList(e);
  }
  if (e.target.id === "cookMeal") {
    evaluateMeal(e);
  }
  if (e.target.id === "okButton") {
    domUpdates.closeCookMealMessage();
  }
})
allRecipesBtn.addEventListener("click", () => {
   domUpdates.showAllRecipes(recipeRepo.recipes, fullRecipeInfo);
});
filterBtn.addEventListener("click", showFilteredRecipes);
main.addEventListener("click", addToMyRecipes);
pantryBtn.addEventListener("click", () => {
  domUpdates.toggleMenu(menuOpen);
  findPantryInfo()
  menuOpen = !menuOpen;
});
savedRecipesBtn.addEventListener("click", () => {
  domUpdates.showSavedRecipes("favoriteRecipes", recipeRepo.recipes, user);
});
cookListButton.addEventListener("click", () => {
  domUpdates.showSavedRecipes("recipesToCook", recipeRepo.recipes, user);
});
searchBtn.addEventListener("click", searchRecipes);
showPantryRecipes.addEventListener("click", findCheckedPantryBoxes);
searchForm.addEventListener("submit", pressEnterSearch);
addToPantryButton.addEventListener("click", addToPantry)
removeFromPantryButton.addEventListener("click", removeFromPantry)

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

  const recipesPromise = fetch("http://localhost:3001/api/v1/recipes")
    .then(response => response.json())
    .then(data => data)

  const ingredientsPromise = fetch("http://localhost:3001/api/v1/ingredients")
    .then(response => response.json())
    .then(data => data)

  Promise.all([usersPromise, recipesPromise, ingredientsPromise])
    .then(data => loadDOM(data))
    .catch(error => domUpdates.displayGetError(error));
}

// GENERATE A USER ON LOAD
function generateUser(users) {
  user = new User(users[Math.floor(Math.random() * users.length)]);
  domUpdates.displayUser(user);
  findPantryInfo();
}

// POST FETCH REQUEST
function changePantryIngredientAmount(userId, ingredientId, ingredientAmount, functionToExecute) {
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
    .then(data => console.log("post finished"))
    .then(data => functionToExecute())
    .catch(error => domUpdates.displayGetError(error, fullRecipeInfo))
}

// FILTER BY RECIPE TAGS

function findCheckedBoxes() {
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
  domUpdates.unhideUnselectedRecipes(recipeRepo.recipes);
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
  domUpdates.generateRecipeTitle(recipe, generateIngredients(recipe), fullRecipeInfo, generateRecipeCost(recipe));
   domUpdates.addRecipeImage(recipe);
  domUpdates.displayRecipeInstructions(recipe, fullRecipeInfo);
}

function generateIngredients(recipe) {
  return recipe && recipe.ingredients.map(i => {
    const ingredient = ingredientsData.find(ingredient => ingredient.id === i.id);
    return `${ingredient.name} (${i.quantity.amount} ${i.quantity.unit})`
  }).join(", ");
}

function generateRecipeCost(recipe) {
  const cost = recipe.calculateIngredientsCost(ingredientsData).toFixed(2);
  return `$${cost}`;
}

function addRecipeToList(e) {
  const recipeId = parseInt(e.target.closest("section").id);
  const recipeToAdd = recipeRepo.recipes.find(recipe => recipe.id === recipeId);
  user.decideToCook(recipeToAdd.id);
}

// SEARCH RECIPES
function pressEnterSearch(event) {
  event.preventDefault();
  // fullRecipeInfo.style.display = "none";
  searchRecipes();
}

function searchRecipes() {
  domUpdates.showAllRecipes(recipeRepo.recipes, fullRecipeInfo);
  let searchedRecipes = recipeRepo.recipes.filter(recipe => {
    return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  filterNonSearched(searchedRecipes);
}

function filterNonSearched(filtered) {
  let found = recipeRepo.recipes.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id)
  })
  found.forEach(foundRecipe => domUpdates.hideUnselectedRecipes(foundRecipe)
  )
}

// CREATE AND USE PANTRY

function findPantryInfo() {
  let pantryItems = [];
    user.pantry.pantryIngredients.forEach(pantryItem => {
    	ingredientsData.forEach(ingredient => {
    		if (ingredient.id === pantryItem.ingredient) {
    			pantryItems.push({name: ingredient.name, id: ingredient.id, count: pantryItem.amount})
    }
  })
    domUpdates.displayPantryInfo(pantryItems.sort((a, b) => a.name.localeCompare(b.name)), pantrySection);
  })
}

function findCheckedPantryBoxes() {
  let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
  let pantryCheckboxInfo = Array.from(pantryCheckboxes)
  // let selectedIngredients = pantryCheckboxInfo.filter(box => {
  //   return box.checked;
  // })
  let selectedIngredients = [];
  pantryCheckboxInfo.forEach(box => {
    if (box.checked) {
      selectedIngredients.push(box.id)
    }
  })
  domUpdates.showAllRecipes(recipeRepo.recipes, );
  if (selectedIngredients.length > 0) {
    findRecipesWithCheckedIngredients(selectedIngredients);
  }
}

function findRecipesWithCheckedIngredients(selected) {
  let recipeChecker = (arr, target) => target.every(v => arr.includes(v));
  let ingredientNames = selected.map(item => {
    return item.id;
  })
  recipeRepo.recipes.forEach(recipe => {
    let allRecipeIngredients = [];
    recipe.ingredients.forEach(ingredient => {
      allRecipeIngredients.push(ingredient.name);
    });
    if (!recipeChecker(allRecipeIngredients, ingredientNames)) {
      domUpdates.hideRecipes(recipe.id);
    }
  })
}

//COOK MEAL

function evaluateMeal(event) {
  const recipeId = parseInt(event.target.closest("section").id);
  const recipeToAdd = recipeRepo.recipes.find(recipe => recipe.id === recipeId);
  if (!user.pantry.checkIngredientsMeal(recipeToAdd)) {
    const missingIngredients = user.pantry.findMissingIngredientsMeal(recipeToAdd);
    const ingredientList = missingIngredients.map(i => {
      const ingredient = ingredientsData.find(ingredient => {
        return ingredient.id === i.ingredient
      });
      return `${ingredient.name} (${i.amount} ${i.unit})`
    }).join(", ");
    domUpdates.displayMissingIngredients(ingredientList, searchBtn)
  } else {
    removeCookingIngredients(recipeToAdd);
    domUpdates.displayCookingSuccessMessage();
  }
}

function removeCookingIngredients(recipe) {
  recipe.ingredients.forEach(ingredient => {
    user.pantry.pantryIngredients.forEach(pantryItem => {
      if (ingredient.id === pantryItem.ingredient) {
        changePantryIngredientAmount(user.id, ingredient.id, -ingredient.quantity.amount, () => {updatePantryAfterCooking(recipe)});
      }
    })
  })
}

function updatePantryAfterCooking(recipe) {
  user.pantry.useIngredientsCookMeal(recipe);
  findPantryInfo();
}

function removeFromPantry() {
  let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
  let pantryCheckboxInfo = Array.from(pantryCheckboxes)
  let selectedIngredients = [];
  pantryCheckboxInfo.forEach(box => {
    if (box.checked) {
      selectedIngredients.push(parseInt(box.id))
    }
  })
  selectedIngredients.forEach(ingredient => {
    user.pantry.pantryIngredients.forEach(pantryItem => {
      if (pantryItem.ingredient === ingredient) {
        changePantryIngredientAmount(user.id, ingredient, -pantryItem.amount, () => {updatePantryRemovingIngredients(selectedIngredients)});
      }
    })
  })
}

function updatePantryRemovingIngredients(selectedIngredients) {
  selectedIngredients.forEach(ingredient => {
    user.pantry.pantryIngredients.forEach(pantryItem => {
      if (pantryItem.ingredient === ingredient) {
        pantryItem.amount = 0
      }
    })
  })
  findPantryInfo();
}

function addToPantry() {
  const ingredientInput = pantryIngredientInput.value.toLowerCase()
  const amountInput = parseInt(pantryIngredientAmountInput.value)
  const foundIngredient = ingredientsData.find(ingredient => ingredient.name === ingredientInput)
  user.pantry.pantryIngredients.forEach(ingredient => {
    if (ingredient.ingredient === foundIngredient.id) {
      changePantryIngredientAmount(user.id, ingredient.ingredient, amountInput, () => {updatePantryAddQuantity(ingredient, amountInput)})
    }
  })
  if (!user.pantry.pantryIngredients.some(ingredient => ingredient.ingredient === foundIngredient.id)) {
    changePantryIngredientAmount(user.id, foundIngredient.id, amountInput, () => {updatePantryAddIngredients(foundIngredient, amountInput)})
  }
}

function updatePantryAddQuantity(ingredient, amountInput) {
  console.log(ingredient);
  ingredient.amount += amountInput;
  findPantryInfo();
}

function updatePantryAddIngredients(foundIngredient, amountInput) {
  console.log(foundIngredient);
  user.pantry.pantryIngredients.push({ingredient: foundIngredient.id, amount: amountInput})
  findPantryInfo()
}
