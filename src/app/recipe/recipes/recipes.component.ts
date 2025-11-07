import { Component, inject, OnInit, signal } from '@angular/core';
import { RecipeService } from '../../shared/services/recipe.service';
import { Recipe } from '../../shared/models/recipe';
import { RecipeCardComponent } from "../../shared/ui/recipe-card/recipe-card.component";

@Component({
  selector: 'app-recipes',
  imports: [RecipeCardComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})

export class RecipesComponent implements OnInit {
  private recipeSvc = inject(RecipeService);
  recipes = signal<Recipe[]>([]);

  ngOnInit(): void {
    this.recipeSvc.getAllRecipies().subscribe((recipes) => {
      this.recipes.set(recipes);
    });
  }
}
