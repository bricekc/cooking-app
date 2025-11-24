import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);
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
    
    // Check for category query param
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.category_research.set(params['category']);
      }
    });
  }

  resetFilters() {
    this.recipe_research.set('');
    this.category_research.set('');
  }
}
