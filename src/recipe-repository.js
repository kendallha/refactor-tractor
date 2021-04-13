import Recipe from '../src/recipe';

class RecipeRepository {
  constructor(recipeData) {
    this.recipes = recipeData.map(recipe => new Recipe(recipe));
  }

  filterRecipes(quality, filterValues) {
    // let recipeNames = this.recipes.map(recipe => recipe[quality]);
    // return recipeNames.filter(name => {
    //   filterValues.every(name)
    // })
  }

  filterRecipesByName(name) {
    return this.recipes.filter(recipe => recipe.name.includes(name));
  }
}

export default RecipeRepository;
