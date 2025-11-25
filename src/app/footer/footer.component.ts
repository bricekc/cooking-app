import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RecipeService } from '../shared/services/recipe.service';
import { Category } from '../shared/models/recipe';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  private recipeSvc = inject(RecipeService);
  private router = inject(Router);
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.recipeSvc.getAllCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  navigateToCategory(categoryName: string) {
    this.router.navigate(['/recipes'], { 
      queryParams: { category: categoryName.toLowerCase() } 
    });
  }
}
