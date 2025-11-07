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

          console.log(recipesContent)
          return recipesContent;
        }
      )
    );
  }
}
