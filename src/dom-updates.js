let domUpdates = {
  displayUser(user) {
    let firstName = user.name.split(" ")[0];
    let welcomeMsg = `
      <div class="welcome-msg">
        <h1>Welcome ${firstName}!</h1>
      </div>`;
    document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
      welcomeMsg);
  },

  displayTags(recipeRepo, element) {
    let tags = [];
    recipeRepo.recipes.forEach(recipe => {
      recipe.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    tags.sort();
    domUpdates.listTags(tags, element);
  },

  createCards(recipeRepo, element) {
    recipeRepo.recipes.forEach(recipe => {
      let recipeName = recipe.name;
      if (recipe.name.length > 40) {
        recipeName = recipe.name.substring(0, 40) + "...";
      }
      domUpdates.addToDom(recipe, recipeName, element);
    });
  },

  addToDom(recipeInfo, shortRecipeName, element) {
    let cardHtml = `
      <article class="recipe-card" id=${recipeInfo.id}>
        <h3 maxlength="40">${shortRecipeName}</h3>
        <div class="card-photo-container">
          <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
          <div class="text">
            <div>Click for Instructions</div>
          </div>
        </div>
        <h4>${recipeInfo.tags[0]}</h4>
        <img src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
      </article>`
    element.insertAdjacentHTML("beforeend", cardHtml);
  },

  listTags(allTags, element) {
    allTags.forEach(tag => {
      let tagHtml = `<li><input type="checkbox" class="checked-tag" role="checkbox" id="${tag}">
        <label for="${tag}">${domUpdates.capitalize(tag)}</label></li>`;
      element.insertAdjacentHTML("beforeend", tagHtml);
    });
  },

  capitalize(words) {
    return words.split(" ").map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
  },

  hideUnselectedRecipes(foundRecipes) {
    let domRecipe = document.getElementById(`${foundRecipes.id}`);
    domRecipe.style.display = "none";
  },

  unhideUnselectedRecipes(foundRecipes) {
    foundRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "block";
    });
  },

  showSavedRecipes(list, recipes, user) {
    let unsavedRecipes = recipes.filter(recipe => {
      return !user[list].some(listItem => listItem.id === recipe.id);
    });
    unsavedRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
    domUpdates.showMyRecipesBanner();
  },

  showCookableRecipes(cookable, recipes) {
    let unsavedRecipes = recipes.filter(recipe => {
      return !cookable.includes(recipes);
    });
    unsavedRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
    domUpdates.showMyRecipesBanner();
  },


  generateRecipeTitle(recipe, ingredients, element, cost) {
    element.id = `${recipe.id}`;
    element.insertAdjacentHTML('afterbegin', '<button id="exit-recipe-btn">X</button>');
    let recipeTitle = `
      <h3 class ="recipe-title" id="recipe-title">${recipe.name}</h3>
      <h4 class="ingredients-label">Ingredients</h4>
      <p>${ingredients}</p>
      <h4>Cost</h4>
      <p>${cost}<p>`;
    element.innerHTML += recipeTitle;
  },

  addRecipeImage(recipe) {
    document.getElementById("recipe-title").style.backgroundImage = `url(${recipe.image})`;
  },

  showMyRecipesBanner() {
    document.querySelector(".welcome-msg").style.display = "none";
    document.querySelector(".my-recipes-banner").style.display = "block";
  },

  showWelcomeBanner() {
    document.querySelector(".welcome-msg").style.display = "flex";
    document.querySelector(".my-recipes-banner").style.display = "none";
  },

  exitRecipe(element) {
    while (element.firstChild && element.removeChild(element.firstChild));
    element.style.display = "none";
    element.innerHTML =
    `
      <div id="mealButtonWrapper">
        <button class="add-button" id="addToList">Add to List to Cook</button>
        <button class="add-button" id="cookMeal">Cook this Meal</button>
      </div>
    `;
  },

  toggleMenu(menuOpen) {
    var menuDropdown = document.querySelector(".drop-menu");
    if (menuOpen) {
      menuDropdown.style.display = "block";
    } else {
      menuDropdown.style.display = "none";
    }
  },

  isDescendant(parent, child) {
    let node = child;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  },

  hideRecipes(recipeId) {
    let domRecipe = document.getElementById(`${recipeId}`);
    domRecipe.style.display = "none";
  },

  showAllRecipes(recipes, element) {
    recipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "block";
    });
    element.style.display = "none";
    domUpdates.showWelcomeBanner();
  },

  displayPantryInfo(pantry, element) {
    element.innerHTML = '';
    pantry.forEach(ingredient => {
      let ingredientHtml = `
        <li><input type="checkbox" class="pantry-checkbox" role="checkbox" id="${ingredient.id}">
        <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
      element.innerHTML += ingredientHtml;
    });
  },

  displayRecipeInfo(element) {
    element.insertAdjacentHTML("beforebegin", "<section id='overlay'></section>");
  },

  displayRecipeInstructions(recipe, element) {
    let instructionsList = "";
    let instructions = recipe.instructions.map(i => {
      return i.instruction;
    });
    instructions.forEach(i => {
      instructionsList += `<li>${i}</li>`;
    });
    element.innerHTML += `<h4>Instructions</h4>
      <ol>${instructionsList}</ol>`;
  },

  displayMissingIngredients(missingIngredients) {
    const missingIngredientMessage =
    `
      <div id="cookMessage">
        <h4>You need the following ingredients:</h4>
        <p>${missingIngredients}</p>
        <button class="add-button" id="okButton">Clear Message</button>
       </div>
    `;
    document.getElementById("mealButtonWrapper").insertAdjacentHTML('afterend', `${missingIngredientMessage}`);
  },

  displayCookingSuccessMessage() {
    const successMessage =
    `
      <div id="cookMessage">
        <h4>You cooked this meal! The items have been removed from your pantry.</h4>
        <button class="add-button" id="okButton">Clear Message</button>
      </div>
    `;
    document.getElementById("mealButtonWrapper").insertAdjacentHTML('afterend', `${successMessage}`);
  },

  closeCookMealMessage() {
    document.getElementById("cookMessage").innerHTML = ``;
  },

  displayGetError(element) {
    let errorMsg =
    `
      <div class="error-msg welcome-msg">
        <h1>Oh no! Something went wrong, please try again!</h1>
      </div>
    `;
    document.querySelector(".banner-image").insertAdjacentHTML("afterbegin", errorMsg);
    element.style.display = "none";
  },
}

export default domUpdates;
