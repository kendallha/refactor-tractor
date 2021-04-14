import { expect } from 'chai';

import Recipe from '../src/recipe';
import RecipeRepository from '../src/recipe-repository';
import recipeData from '../src/data/recipe-test-data';

describe('RecipeRepository', function() {
  let recipe;
  let recipeInfo;

  beforeEach(function() {
    recipeInfo = recipeData;
    recipe = new RecipeRepository(recipeInfo);
  })

  it('is a function', function() {
    expect(RecipeRepository).to.be.a('function');
  });

  it('should be an instance of RecipeRepository', function() {
    expect(recipe).to.be.an.instanceof(RecipeRepository);
  });

  it('should create a new instance of Recipe for each recipe', function() {
    expect(recipe.recipes[0]).to.be.an.instanceof(Recipe);
  });

  it('should be able to filter recipes based on ingredients', function() {
    expect(recipe.filterRecipesByIngredient(['sriracha'])).to.deep.equal([]);
    expect(recipe.filterRecipesByIngredient(['baking soda'])).to.deep.equal([recipe.recipes[0]]);
  })

  it('should be able to filter recipes based on tag(s)', function() {
    expect(recipe.filterRecipesByTag(['breakfast'])).to.deep.equal([]);
    expect(recipe.filterRecipesByTag(['snack'])).to.deep.equal([recipe.recipes[0], recipe.recipes[1]]);
    expect(recipe.filterRecipesByTag(['snack', 'antipasto'])).to.deep.equal([recipe.recipes[0]]);
  })

  it.only('should be able to filter recipes based on name', function() {
    expect(recipe.filterRecipesByName("Pudding")).to.deep.equal([recipe.recipes[0]]);
  })
})
