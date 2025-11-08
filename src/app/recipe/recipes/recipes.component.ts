import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RecipeService } from '../../shared/services/recipe.service';
import { Category, Recipe } from '../../shared/models/recipe';
import { RecipeCardComponent } from '../../shared/ui/recipe-card/recipe-card.component';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-recipes',
  imports: [RecipeCardComponent, FormsModule, TitleCasePipe],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent implements OnInit {
  private recipeSvc = inject(RecipeService);
  recipes = signal<Recipe[]>([]);
  recipe_research = signal<string>('');
  category_research = signal<string>('');
  filtered_recipes = computed(() =>
    this.recipes()
      .filter((recipe) =>
        recipe.name.toLowerCase().includes(this.recipe_research())
      )
      .filter((recipe) => {
        console.log(!!this.category_research())
        if (this.category_research())
          return recipe.category.toLowerCase() === this.category_research();
        else
          return true
      })
  );
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.recipeSvc.getAllRecipies().subscribe((recipes) => {
      this.recipes.set(recipes);
    });
    this.recipeSvc.getAllCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  resetFilters() {
    this.recipe_research.set('');
    this.category_research.set('');
  }
}
