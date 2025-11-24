import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipesComponent } from './recipe/recipes/recipes.component';
import { RecipeDetailsComponent } from './recipe/recipe-details/recipe-details.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'recipes',
    canActivate: [authGuard],
    children: [
      { path: '', component: RecipesComponent },
      { path: 'add', component: RecipeFormComponent },
      { path: ':id', component: RecipeDetailsComponent },
      { path: ':id/edit', component: RecipeFormComponent },
    ],
  },
];
