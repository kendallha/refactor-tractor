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
    // array method (forEach) over our recipe amount for each ingredient
    // For each ingredient amount; look in our pantry and subtract the amount needed for recipe from pantry amount
    // console.log(recipe);
    // let items = recipe.ingredients.forEach(ingredient => {
    //   this.pantryIngredients.find(pantryItem => {
    //    if (pantryItem.ingredient === ingredient.id) {
    //      return pantryItem.amount - ingredient.quantity.amount
    //     }
    //   })
    // });
    // return this.pantryIngredients[0].amount;
  }
}

export default Pantry;
