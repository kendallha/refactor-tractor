import { expect } from 'chai';

import RecipeRepository from '../src/recipe-repository';
import Pantry from '../src/pantry';
import users from '../src/data/user-test-data';
import recipeData from '../src/data/recipe-test-data';
import recipeRepo from '../src/recipe-repository';

describe('Pantry', function() {
  let userInfo;
  let recipe;
  let pantry;

  beforeEach(function() {
    userInfo = users[0];
    pantry = new Pantry(userInfo.pantry);
    recipe = new RecipeRepository(recipeData);
  });

  it('should be a function', function() {
    expect(Pantry).to.be.a('function');
  });

  it('should contain an array of ingredients', function() {
    expect(pantry.pantryIngredients).to.deep.eq(users[0].pantry);
  });

  it('should return true if pantry has ingredients for recipe', function() {
    expect(pantry.checkIngredientsMeal(recipe.recipes[1])).to.eq(true);
  });

  it('should return false if pantry does not have ingredients for recipe', function() {
    expect(pantry.checkIngredientsMeal(recipe.recipes[0])).to.eq(false);
  });

  it('should return an array of missing ingredients for recipe', function() {
    expect(pantry.findMissingIngredientsMeal(recipe.recipes[2])).to.deep.eq([{amount: 1.5, ingredient: 123584, unit: "cups"}]);
  });

  it('should decrease ingredients if used in recipe', function() {
    pantry.useIngredientsCookMeal(recipe.recipes[1]);
    expect(pantry.pantryIngredients[0].amount).to.equal(0.5);
  });
})
