import { Component, input, inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../models/recipe';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent {
  recipe = input.required<Recipe>();
  auth = inject(AuthService);
  private router = inject(Router);
  private recipeService = inject(RecipeService);

  @Output() deleted = new EventEmitter<string>();

  goToEdit() {
    const id = this.recipe().id;
    this.router.navigate(['/recipes', id, 'edit']);
  }
  goToDetails() {
    const id = this.recipe().id;
    this.router.navigate(['/recipes', id]);
  }

  deleteRecipe(event: Event) {
    event.stopPropagation();
    const id = this.recipe().id;
    this.recipeService.deleteRecipe(id).subscribe({
      next: () => {
        this.deleted.emit(id);
      },
      error: (err) => {
        console.error('Erreur suppression recette', err);
      },
    });
  }
}
