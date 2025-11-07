import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipesComponent } from './recipe/recipes/recipes.component';
import { RecipeDetailsComponent } from './recipe/recipe-details/recipe-details.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'recipes',
    component: RecipesComponent
  },
  {
    path: 'recipe/add',
    component: RecipeFormComponent
  },
  {
    path: 'recipe/:id',
    component: RecipeDetailsComponent
  }
];
