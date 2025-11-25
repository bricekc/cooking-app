import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService } from '../../shared/services/recipe.service';
import { Recipe } from '../../shared/models/recipe';
import { AuthService } from '../../shared/services/auth.service';
import { CookingTimePipe } from '../../shared/pipes/cooking-time.pipe';
import { HighlightIngredientDirective } from '../../shared/directives/highlight-ingredient.directive';

@Component({
  selector: 'app-recipe-details',
  imports: [RouterModule, CookingTimePipe, HighlightIngredientDirective],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css',
})
export class RecipeDetailsComponent {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  auth = inject(AuthService);
  recipe = signal<Recipe>(null!);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.recipeService.getRecipeById(id).subscribe((recipe) => {
      this.recipe.set(recipe);
    });
  }

  goBack() {
    window.history.back();
  }
}
