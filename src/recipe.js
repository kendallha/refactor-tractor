class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
    this.instructions = recipe.instructions
  }

  calculateIngredientsCost(ingredientData) {
    let cost = [];
    this.ingredients.forEach(i => {
      ingredientData.forEach(ingredient => {
        if (i.id === ingredient.id) {
          cost.push(ingredient.estimatedCostInCents * i.quantity.amount)
        }
      })
    })
    return cost.reduce((acc, cv) => {
      acc += cv;
      return acc;
    }, 0) / 100;
  }

  findAllIngredientNames() {
    return this.ingredients.map(ingredient => {
      return ingredient.name;
    })
  };

  returnRecipeInstructions() {
    return this.instructions;
  }
}

module.exports = Recipe;
