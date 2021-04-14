class Pantry {
  constructor(pantry) {
    this.pantryIngredients = pantry;
  }

  checkIngredientsMeal(recipe) {
    return recipe.ingredients.every(ingredient =>
      this.pantryIngredients.some(pantryItem => {
        return (pantryItem.ingredient === ingredient.id) && (pantryItem.amount >= ingredient.quantity.amount)
      }))
  }

  findMissingIngredientsMeal(recipe) {

  }

  useIngredientsCookMeal(recipe) {

  }
}

export default Pantry;
