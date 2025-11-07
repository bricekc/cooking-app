import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe-form';
import { Observable } from 'rxjs';

const apiUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor() {}
  private http = inject(HttpClient);

  addRecipes(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${apiUrl}/recipes`, recipe);
  }
}
