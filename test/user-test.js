import { expect } from 'chai';

import User from '../src/user';
import users from '../src/data/user-test-data';

describe('User', function() {
  let user;
  let userInfo;
  let recipe;

  beforeEach(function() {
    userInfo = users[0];

    user = new User(userInfo)

    recipe = {name: 'Chicken Parm', type: ['italian', 'dinner']};
  });

  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should initialize with an id', function() {
    expect(user.id).to.eq(1);
  });

  it('should initialize with a name', function() {
    expect(user.name).to.eq('Saige O\'Kon');
  });

  it('should initialize with a pantry', function() {
    expect(user.pantry.pantryIngredients[0].ingredient).to.eq(1009016);
  });

  it('should initialize with an empty favoriteRecipes array', function() {
    expect(user.favoriteRecipes).to.deep.equal([]);
  });

  it('should initialize with an empty recipesToCook array', function() {
    expect(user.recipesToCook).to.deep.equal([]);
  });

  it('should be able to save a recipe to favoriteRecipes', function() {
    user.saveRecipe(recipe);
    expect(user.favoriteRecipes[0].name).to.equal('Chicken Parm');
  });

  it('should be able to decide to cook a recipe', function() {
    user.decideToCook(recipe);
    expect(user.recipesToCook[0].name).to.equal('Chicken Parm');
  });

  it('should be able to filter recipes by type', function() {
    user.saveRecipe(recipe);
    expect(user.filterRecipes('italian')).to.deep.equal([recipe]);
  });

  it('should be able to search recipes by name', function() {
    user.saveRecipe(recipe);
    expect(user.searchForRecipe('Chicken Parm')).to.deep.equal([recipe]);
  });
});
