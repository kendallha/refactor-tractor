import Recipe from '../src/recipe';

class RecipeRepository {
  constructor(recipeData) {
    this.recipes = recipeData.map(recipe => new Recipe(recipe));
  }

  filterRecipesByTag(values) {
    return this.recipes.filter(recipe => values.every(value => recipe.tags.includes(value)));
   }

  filterRecipesByIngredient(values) {
    return this.recipes.filter(recipe => values.every(value => recipe.ingredients.some(ingredient => value === ingredient.name)));
}

  filterRecipesByName(name) {
    return this.recipes.filter(recipe => recipe.name.includes(name));
  }
}

export default RecipeRepository;
