import { expect } from 'chai';

import Recipe from '../src/recipe';
import recipeData from '../src/data/recipe-test-data';
import ingredientsData from '../src/data/ingredient-test-data';

describe('Recipe', function() {
  let recipe;
  let recipeInfo;
  let ingredientInfo;

  beforeEach(function() {
    recipeInfo = recipeData[0];
    recipe = new Recipe(recipeInfo);
    ingredientInfo = ingredientsData;
  });

  it('is a function', function() {
    expect(Recipe).to.be.a('function');
  });

  it('should be an instance of Recipe', function() {
    expect(recipe).to.be.an.instanceof(Recipe);
  });

  it('should initialize with an id', function() {
    expect(recipe.id).to.eq(595736);
  });

  it('should initialize with an name', function() {
    expect(recipe.name).to.eq('Loaded Chocolate Chip Pudding Cookie Cups');
  });

  it('should initialize with an image', function() {
    expect(recipe.image).to.eq('https://spoonacular.com/recipeImages/595736-556x370.jpg');
  });

  it('should initialize with an array of ingredients', function() {
    const ingredient = {
      "id": 20081,
      "name": "all purpose flour",
      "quantity": {
        "amount": 1.5,
        "unit": "c"
      };
    };
    expect(recipe.ingredients[0]).to.deep.eq(ingredient);
  });

  it('should calculate the total cost of all of the ingredients', function() {
    expect(recipe.calculateIngredientsCost(ingredientInfo)).to.eq(177.76);
  });

  it('should return a list of all the ingredients in the recipe', function() {
    expect(recipe.findAllIngredientNames()).to.deep.eq([
      'all purpose flour',
      'baking soda',
      'egg',
      'granulated sugar',
      'instant vanilla pudding mix',
      'light brown sugar',
      'salt',
      'sea salt',
      'semisweet chocolate chips',
      'unsalted butter',
      'vanilla extract'
    ]);
  });

  it('should return the recipe instructions', function() {
    expect(recipe.returnRecipeInstructions()).to.deep.eq([
      {
        "number": 1,
        "instruction": "In a large mixing bowl, whisk together the dry ingredients (flour, pudding mix, soda and salt). Set aside.In a large mixing bowl of a stand mixer, cream butter for 30 seconds. Gradually add granulated sugar and brown sugar and cream until light and fluffy."
      },
      {
        "number": 2,
        "instruction": "Add egg and vanilla and mix until combined."
      },
      {
        "number": 3,
        "instruction": "Add dry ingredients and mix on low just until incorporated. Stir in chocolate chips.Scoop the dough into 1,5 tablespoon size balls and place on a plate or sheet. Cover with saran wrap and chill at least 2 hours or overnight.When ready to bake, preheat oven to 350 degrees."
      },
      {
        "number": 4,
        "instruction": "Place the cookie dough balls into ungreased muffin pan. Sprinkle with sea salt."
      },
      {
        "number": 5,
        "instruction": "Bake for 9 to 10 minutes, or until you see the edges start to brown."
      },
      {
        "number": 6,
        "instruction": "Remove the pan from the oven and let sit for 10 minutes before removing onto a cooling rack.Top with ice cream and a drizzle of chocolate sauce."
      }
    ]);
  })
});
