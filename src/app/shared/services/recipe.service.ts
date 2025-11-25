import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { Recipe, GetIngredient, GetRecipe, Category } from '../models/recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly API_URL = 'http://localhost:3000';
  private http = inject(HttpClient);
  recipes = signal<Recipe[]>([]);

  getAllRecipies() {
    return combineLatest([
      this.http.get<GetRecipe[]>(`${this.API_URL}/recipes`),
      this.http.get<GetIngredient[]>(`${this.API_URL}/ingredients`),
      this.http.get<Category[]>(`${this.API_URL}/categories`),
    ]).pipe(
      map(
        ([recipes, ingredients, categories]: [
          GetRecipe[],
          GetIngredient[],
          Category[]
        ]) => {
          const recipesContent: Recipe[] = [];

          for (const recipe of recipes) {
            const formatedRecipe: Recipe = {
              ...recipe,
              category: categories.filter(
                (category) => category.id === recipe.categoryId
              )[0].category,
              ingredients: recipe.ingredients.map((recipeIngredient) => ({
                ...recipeIngredient,
                name: ingredients.filter(
                  (ingredient) => ingredient.id === recipeIngredient.id
                )[0].name,
              })),
            };
            recipesContent.push(formatedRecipe);
          }

          return recipesContent;
        }
      )
    );
  }
  addRecipes(recipe: Recipe) {
    return this.http.post<Recipe>(`${this.API_URL}/recipes`, recipe);
  }
  updateRecipe(recipe: Recipe) {
    return this.http.put<Recipe>(
      `${this.API_URL}/recipes/${recipe.id}`,
      recipe
    );
  }
  deleteRecipe(id: string) {
    return this.http.delete(`${this.API_URL}/recipes/${id}`);
  }
  getAllCategories() {
    return this.http.get<Category[]>(`${this.API_URL}/categories`);
  }

  getAllIngredients() {
    return this.http.get<GetIngredient[]>(`${this.API_URL}/ingredients`);
  }

  getRecipeById(id: string) {
    return combineLatest([
      this.http.get<GetRecipe>(`${this.API_URL}/recipes/${id}`),
      this.http.get<GetIngredient[]>(`${this.API_URL}/ingredients`),
      this.http.get<Category[]>(`${this.API_URL}/categories`),
    ]).pipe(
      map(([recipe, ingredients, categories]) => {
        const category =
          categories.find((c) => c.id === recipe.categoryId)?.category ??
          'Sans catégorie';

        const formattedIngredients = recipe.ingredients.map((ing) => ({
          id: ing.id,
          name:
            ingredients.find((i) => i.id === ing.id)?.name ||
            'Ingrédient inconnu',
          quantity: ing.quantity,
          unit: ing.unit,
        }));

        return {
          ...recipe,
          category,
          ingredients: formattedIngredients,
        };
      })
    );
  }
}
