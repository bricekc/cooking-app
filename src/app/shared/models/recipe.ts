export interface GetRecipe {
  id: string
  userId: string
  categoryId: string
  name: string
  description: string
  ingredients: Ingredient[]
  steps: Step[]
  difficulty: string
  cookTime: string
  prepTime: string
  imageURL: string
}

export interface Recipe {
  id: string
  userId: string
  categoryId: string
  category: string
  name: string
  description: string
  ingredients: Ingredient[]
  steps: Step[]
  difficulty: string
  cookTime: string
  prepTime: string
  imageURL: string
}

interface Ingredient {
  id: string
  quantity: string
  unit: string
}

interface Ingredient {
  id: string
  quantity: string
  unit: string
  name: string
}

interface Step {
  order: number
  description: string
}

export interface GetIngredient {
  id: string
  name: string
}

export interface Category {
  id: string
  category: string
}