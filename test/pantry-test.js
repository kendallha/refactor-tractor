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
    expect(pantry.pantryIngredients).to.deep.eq([
      {
        "ingredient": 1009016,
        "amount": 2
      },
      {
        "ingredient": 11477,
        "amount": 1
      },
      {
        "ingredient": 93820,
        "amount": 1
      },
      {
        "ingredient": 11297,
        "amount": 3
      },
      {
        "ingredient": 11547,
        "amount": 5
      },
      {
        "ingredient": 1082047,
        "amount": 5
      },
      {
        "ingredient": 1032050,
        "amount": 1
      },
      {
        "ingredient": 20081,
        "amount": 4
      },
      {
        "ingredient": 11215,
        "amount": 2
      },
      {
        "ingredient": 10514037,
        "amount": 2
      },
      {
        "ingredient": 2047,
        "amount": 2
      },
      {
        "ingredient": 12179,
        "amount": 1
      },
      {
        "ingredient": 1123,
        "amount": 4
      },
      {
        "ingredient": 11282,
        "amount": 5
      },
      {
        "ingredient": 9016,
        "amount": 4
      },
      {
        "ingredient": 14003,
        "amount": 4
      },
      {
        "ingredient": 6194,
        "amount": 2
      },
      {
        "ingredient": 16112,
        "amount": 1
      },
      {
        "ingredient": 6172,
        "amount": 3
      },
      {
        "ingredient": 2044,
        "amount": 2
      },
      {
        "ingredient": 2050,
        "amount": 3
      }
    ])
  });

  it('should return true if pantry has ingredients for recipe', function() {
    expect(pantry.checkIngredientsMeal(recipe.recipes[1])).to.eq(true);
  });

  it('should return false if pantry does not have ingredients for recipe', function() {
    expect(pantry.checkIngredientsMeal(recipe.recipes[0])).to.eq(false);
  });

  it.only('should return an array of missing ingredients for recipe', function() {
    expect(pantry.findMissingIngredientsMeal(recipe.recipes[1])).to.deep.eq([{ingredient: "apple cider", amount: 0.5}])
  });
  //
  // it('should decrease ingredients if used in recipe', function() {
  //   expect(pantry.useIngredientsCookMeal(recipe)).to.deep.equal()
  // })
})
