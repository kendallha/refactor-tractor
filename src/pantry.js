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
    const missingItems = [];
    const items = recipe.ingredients.forEach(ingredient => {
      if (!this.pantryIngredients.find(pantryItem => {
        return (pantryItem.ingredient === ingredient.id) &&
               (pantryItem.amount >= ingredient.quantity.amount)
      })) {
        const pantryAmount = this.pantryIngredients.find(pantryItem => pantryItem.ingredient === ingredient.id)
      missingItems.push({ingredient: ingredient.name, amount: ingredient.quantity.amount - pantryAmount.amount})
      }
    })
    return missingItems;
  }


  useIngredientsCookMeal(recipe) {

  }
}

export default Pantry;
