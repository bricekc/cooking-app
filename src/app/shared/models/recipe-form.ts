export interface Recipe {
  id?: string;
  categoryId: string;
  name: string;
  description: string;
  ingredients: {
    id: string;
    quantity: string;
    unit: string;
  }[];
  steps: {
    order: string;
    description: string;
  }[];
  difficulty: string;
  cookTime: string;
  prepTime: string;
  imageURL: string;
}
