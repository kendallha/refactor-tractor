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
  addToDom(recipeInfo, shortRecipeName, element) {
    let cardHtml = `
      <div class="recipe-card" id=${recipeInfo.id}>
        <h3 maxlength="40">${shortRecipeName}</h3>
        <div class="card-photo-container">
          <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
          <div class="text">
            <div>Click for Instructions</div>
          </div>
        </div>
        <h4>${recipeInfo.tags[0]}</h4>
        <img src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
      </div>`
    element.insertAdjacentHTML("beforeend", cardHtml);
  },

  listTags(allTags, element) {
    allTags.forEach(tag => {
      let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
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
    foundRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
  },

  showSavedRecipes(recipes, user) {
    let unsavedRecipes = recipes.filter(recipe => {
      return !user.favoriteRecipes.includes(recipe.id);
    });
    unsavedRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
    domUpdates.showMyRecipesBanner();
  },

  generateRecipeTitle(recipe, ingredients, element) {
    let recipeTitle = `
      <button id="exit-recipe-btn">X</button>
      <h3 id="recipe-title">${recipe.name}</h3>
      <h4>Ingredients</h4>
      <p>${ingredients}</p>`
    element.insertAdjacentHTML("beforeend", recipeTitle);
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
    while (element.firstChild &&
      element.removeChild(element.firstChild));
    element.style.display = "none";
    document.getElementById("overlay").remove();
  },

  toggleMenu(menuOpen) {
    var menuDropdown = document.querySelector(".drop-menu");
    menuOpen = !menuOpen;
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

  showAllRecipes(recipes) {
    recipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "block";
    });
    domUpdates.showWelcomeBanner();
  }

}

export default domUpdates;