import { expect } from 'chai';

import RecipeRepository from '../src/recipe-repository';
import User from '../src/user';
import Pantry from '../src/pantry';
import users from '../src/data/user-test-data';
import recipeData from '../src/data/recipe-test-data';
import recipeRepo from '../src/recipe-repository';

describe('Pantry', function() {
  let user;
  let userInfo;
  let recipe;
  let pantry;

  beforeEach(function() {
    userInfo = users[0];

    user = new User(userInfo);

    pantry = new Pantry(user.pantry);

    recipe = new RecipeRepository(recipeData);

  });

  it('should be a function', function() {
    expect(Pantry).to.be.a('function');
  });

  it('should contain an array of ingredients', function() {
    expect(pantry.pantryIngredients).to.deep.eq(user.pantry)
  });

  it('should return true if pantry has ingredients for recipe', function() {
    expect(pantry.checkIngredientsMeal(recipe.recipes[1])).to.eq(true);
  });

  it('should return false if pantry does not have ingredients for recipe', function() {
    expect(pantry.checkIngredientsMeal(recipe.recipes[0])).to.eq(false);
  });

  it('should return an array of missing ingredients for recipe', function() {
    expect(pantry.findMissingIngredientsMeal(recipe.recipes[1])).to.deep.eq([{ingredient: "apple cider", amount: 0.5}])
  });

  it('should decrease ingredients if used in recipe', function() {
    pantry.useIngredientsCookMeal(recipe.recipes[1]);
    expect(user.pantry[0].amount).to.deep.equal(0.5);
  })
})
