import { Component, input } from '@angular/core';
import { Recipe } from '../../models/recipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent {
  recipe = input.required<Recipe>();
}
