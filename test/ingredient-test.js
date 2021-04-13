import { expect } from 'chai';

import Ingredient from '../src/ingredient';
import ingredientData from '../src/data/ingredient-test-data';

describe('Ingredient', function() {
  let ingredient;
  let ingredientInfo;

  beforeEach(function() {
    ingredientInfo = ingredientData[0];
    ingredient = new Ingredient(ingredientInfo);
  })

  it('is a function', function() {
    expect(Ingredient).to.be.a('function');
  });

  it('should be an instance of Ingredient', function() {
    expect(ingredient).to.be.an.instanceof(Ingredient);
  });

  it('should be able to store an id', function() {
    expect(ingredient.id).to.equal(20081);
  });

  it('should be able to store the name of the ingredient', function() {
    expect(ingredient.name).to.equal("wheat flour");
  });

  it('should be able to store the estimated cost in cents', function() {
    expect(ingredient.estimatedCostInCents).to.equal(142);
  });
})
