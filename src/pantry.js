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
    recipe.ingredients.forEach(ingredient => {
      if (!this.pantryIngredients.find(pantryItem => (pantryItem.ingredient === ingredient.id))) {
        missingItems.push({ingredient: ingredient.id, amount: ingredient.quantity.amount, unit: ingredient.quantity.unit});
      }
      this.pantryIngredients.forEach(pantryItem => {
        if ((pantryItem.ingredient === ingredient.id) && (pantryItem.amount < ingredient.quantity.amount))
        missingItems.push({ingredient: ingredient.id, amount: ingredient.quantity.amount - pantryItem.amount, unit: ingredient.quantity.unit})
      }
    )})
    return missingItems;
  }


  useIngredientsCookMeal(recipe) {
    if (this.checkIngredientsMeal(recipe)) {
     recipe.ingredients.forEach(ingredient => {
        this.pantryIngredients.forEach((pantryItem => {
          if (pantryItem.ingredient === ingredient.id) {
            pantryItem.amount = pantryItem.amount - ingredient.quantity.amount
          }

        } ))
      })
    }
  }
}

export default Pantry;
