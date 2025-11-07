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
import { Router } from '@angular/router';

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
  recipeForm: FormGroup;
  constructor() {
    this.recipeForm = this.createForm();
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

  // Helpers to create default ingredient/step groups
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

  // Getters for template access
  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  // Optional helpers to manage arrays from the template
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
      console.log(this.recipeForm.value);
      // Logique pour sauvegarder la recette
    }
  }

    // Ajoutez cette méthode pour vérifier la validité
  checkFormValidity() {
    console.log('Formulaire valide ?', this.recipeForm.valid);
    console.log('Erreurs du formulaire :', this.recipeForm.errors);
    console.log('Valeurs du formulaire :', this.recipeForm.value);

    // Vérifiez les ingrédients
    this.ingredients.controls.forEach((control, index) => {
      console.log(`Ingrédient ${index} valide ?`, control.valid);
      console.log(`Erreurs ingrédient ${index} :`, control.errors);
    });

    // Vérifiez les étapes
    this.steps.controls.forEach((control, index) => {
      console.log(`Étape ${index} valide ?`, control.valid);
      console.log(`Erreurs étape ${index} :`, control.errors);
    });
  }
  
}
