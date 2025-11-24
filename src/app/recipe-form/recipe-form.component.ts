import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../shared/services/recipe.service';
import { AuthService } from '../shared/services/auth.service';
import { Recipe, GetIngredient } from '../shared/models/recipe';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
})
export class RecipeFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private recipeSvc = inject(RecipeService);
  private authSvc = inject(AuthService);
  private route = inject(ActivatedRoute);
  isEditMode = false;
  editingId: string | null = null;
  availableIngredients: GetIngredient[] = [];
  recipeForm: FormGroup;
  constructor() {
    this.recipeForm = this.createForm();
    this.loadIngredients();
    this.checkEditMode();
  }

  private checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.editingId = id;
      this.loadRecipeForEdit(id);
    }
  }

  private loadRecipeForEdit(id: string) {
    this.recipeSvc.getRecipeById(id).subscribe({
      next: (recipe) => {
        // Patch basic fields
        this.recipeForm.patchValue({
          categoryId: recipe.categoryId,
          name: recipe.name,
          description: recipe.description,
          difficulty: recipe.difficulty,
          cookTime: recipe.cookTime,
          prepTime: recipe.prepTime,
          imageURL: recipe.imageURL,
        });

        // Patch ingredients
        const ingFA = this.recipeForm.get('ingredients') as FormArray;
        while (ingFA.length) {
          ingFA.removeAt(0);
        }
        for (const ing of recipe.ingredients) {
          ingFA.push(
            this.fb.group({
              id: [ing.id, Validators.required],
              quantity: [ing.quantity, Validators.required],
              unit: [ing.unit, Validators.required],
            }),
          );
        }

        // Patch steps
        const stepsFA = this.recipeForm.get('steps') as FormArray;
        while (stepsFA.length) {
          stepsFA.removeAt(0);
        }
        for (const s of recipe.steps) {
          stepsFA.push(
            this.fb.group({
              order: [s.order],
              description: [s.description, Validators.required],
            }),
          );
        }
      },
      error: (err) => console.error('Impossible de charger la recette à éditer', err),
    });
  }

  private loadIngredients() {
    this.recipeSvc.getAllIngredients().subscribe({
      next: (list) => {
        this.availableIngredients = list;
      },
      error: (err) => {
        console.error('Impossible de charger les ingrédients', err);
      },
    });
  }
  private createForm(): FormGroup {
    return this.fb.group({
      categoryId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredient()]),
      steps: this.fb.array([this.createStep()]),
      difficulty: [''],
      cookTime: [''],
      prepTime: [''],
      imageURL: [''],
    });
  }

  private createIngredient(): FormGroup {
    return this.fb.group({
      id: ['', Validators.required],
      quantity: ['', Validators.required],
      unit: ['', Validators.required],
    });
  }

  private createStep(): FormGroup {
    return this.fb.group({
      order: ['1'],
      description: ['', Validators.required],
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addStep() {
    this.steps.push(this.createStep());
    this.updateStepOrders();
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
    this.updateStepOrders();
  }

  private updateStepOrders() {
    this.steps.controls.forEach((ctrl, index) => {
      ctrl.get('order')?.setValue((index + 1).toString());
    });
  }

  goBack() {
    this.router.navigate(['/recipes']);
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      const val = this.recipeForm.value;

      const currentUser = this.authSvc.currentUser();
      const userId = currentUser?.id ?? '1';

      const newRecipe: Recipe = {
        id: this.isEditMode && this.editingId ? this.editingId : this.generateId(),
        userId,
        categoryId: val.categoryId,
        category: '',
        name: val.name,
        description: val.description,
        ingredients: (val.ingredients || []).map((ing: any) => ({
          id: ing.id,
          quantity: ing.quantity,
          unit: ing.unit,
          name:
            this.availableIngredients.find((a) => a.id === ing.id)?.name || '',
        })),
        steps: (val.steps || []).map((s: any) => ({
          order: typeof s.order === 'string' ? parseInt(s.order, 10) : s.order,
          description: s.description,
        })),
        difficulty: val.difficulty || '',
        cookTime: val.cookTime || '',
        prepTime: val.prepTime || '',
        imageURL: val.imageURL || '',
      };
      const save$ = this.isEditMode && this.editingId
        ? this.recipeSvc.updateRecipe(newRecipe)
        : this.recipeSvc.addRecipes(newRecipe);

      save$.subscribe({
        next: (res) => {
          console.log('Recette sauvegardée', res);
          this.router.navigate(['/recipes']);
        },
        error: (err) => {
          console.error('Erreur lors de la sauvegarde de la recette', err);
          alert('Une erreur est survenue lors de lenregistrement de la recette.');
        },
      });
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
