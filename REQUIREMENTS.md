# Cooking App - Requirements Mapping

This document maps all project requirements to the actual implementation in the codebase.

---

## 📋 Authentication (Sign Up / Sign In)

### Requirement: User authentication system with Sign Up and Sign In

| Component | Location | Details |
|-----------|----------|---------|
| **Login Form** | `src/app/login/login.component.ts` | Sign in component with username/password validation |
| **Register Form** | `src/app/register/register.component.ts` | Sign up component with password confirmation |
| **AuthService** | `src/app/shared/services/auth.service.ts` | Handles login, register, logout, and session management |
| **Backend Endpoint** | `backend/db.json` → `users` collection | Stores user data with authentication |

**Key Implementation Details:**
- Login: `authService.login(credentials)` queries users by username
- Register: `authService.register(userData)` creates new user with validation
- Session: Stored in `localStorage` via `currentUserSignal`
- Logout: Clears user data and redirects to home

**Code Reference:**
- Login validation: `src/app/login/login.component.ts:15-18`
- Register with custom validator: `src/app/register/register.component.ts:20-30`
- Auth service: `src/app/shared/services/auth.service.ts:10-45`

---

## 🛣️ Routing (Minimum 3 routes + route with data transmission)

### Requirement: At least 3 routes, including one that passes data through the route

**Route Configuration:** `src/app/app.routes.ts`

| Route | Component | Features |
|-------|-----------|----------|
| `/` | HomeComponent | Public landing page |
| `/login` | LoginComponent | Authentication page |
| `/register` | RegisterComponent | Registration page |
| `/recipes` | RecipesComponent | Protected route (requires auth) |
| `/recipes/add` | RecipeFormComponent | Create new recipe |
| **`/recipes/:id`** | RecipeDetailsComponent | **Data transmission: ID parameter** |
| **`/recipes/:id/edit`** | RecipeFormComponent | **Edit mode with ID parameter** |

**Total Routes: 7 (exceeds minimum of 3)**

**Route with Data Transmission:**
```typescript
// Route param :id in /recipes/:id
// Used in RecipeDetailsComponent:
const id = this.route.snapshot.paramMap.get('id');
this.recipe = await this.recipeService.getRecipeById(id);
```

**Code Reference:**
- Routes definition: `src/app/app.routes.ts:1-20`
- Route with ID param: `src/app/recipe/recipe-details/recipe-details.component.ts:25-30`
- Edit route with ID: `src/app/recipe-form/recipe-form.component.ts:35-45`

---

## 🧩 Components (Minimum 1 per page + 1 reused 2x + 1 Input + 1 Output)

### Requirement: At least 1 component per page, at least 1 component used 2 times, Input & Output decorators

**Components Per Page:**

| Page/Route | Component | Location |
|-----------|-----------|----------|
| Home `/` | HomeComponent | `src/app/home/home.component.ts` |
| Login `/login` | LoginComponent | `src/app/login/login.component.ts` |
| Register `/register` | RegisterComponent | `src/app/register/register.component.ts` |
| Recipes `/recipes` | RecipesComponent | `src/app/recipe/recipes/recipes.component.ts` |
| Recipe Details `/recipes/:id` | RecipeDetailsComponent | `src/app/recipe/recipe-details/recipe-details.component.ts` |
| Recipe Form `/recipes/add`, `/recipes/:id/edit` | RecipeFormComponent | `src/app/recipe-form/recipe-form.component.ts` |

**Reusable Components (Used 2+ times):**

### ✅ **RecipeCardComponent** - Used 2 times
- **Location:** `src/app/shared/ui/recipe-card/recipe-card.component.ts`
- **Used in:**
  1. `RecipesComponent` - Recipe list display
  2. `HomeComponent` - Featured recipes showcase

**Input & Output Decorators:**
```typescript
// src/app/shared/ui/recipe-card/recipe-card.component.ts

@Input() recipe!: Recipe;              // ✅ Input: receives recipe data
@Output() deleteRecipe = new EventEmitter<string>();  // ✅ Output: emits delete event
@Output() editRecipe = new EventEmitter<Recipe>();    // ✅ Output: emits edit event

onDelete() {
  this.deleteRecipe.emit(this.recipe.id);
}
```

**Additional Reusable Components:**
- **ButtonComponent** - `src/app/shared/ui/button/button.component.ts` (reusable button across forms)
- **InputComponent** - `src/app/shared/ui/input/input.component.ts` (reusable form input)

**Code Reference:**
- RecipeCardComponent: `src/app/shared/ui/recipe-card/recipe-card.component.ts:1-50`
- Input decorator: `src/app/shared/ui/recipe-card/recipe-card.component.ts:6`
- Output decorators: `src/app/shared/ui/recipe-card/recipe-card.component.ts:7-8`
- Usage in RecipesComponent: `src/app/recipe/recipes/recipes.component.html:12-15`
- Usage in HomeComponent: `src/app/home/home.component.html:8-12`

---

## 🔧 Services (Minimum 2)

### Requirement: At least 2 services with specific functionality

### ✅ Service 1: **AuthService**
**Location:** `src/app/shared/services/auth.service.ts`

**Methods:**
- `login(credentials: LoginRequest): Observable<User>` - Authenticates user
- `register(userData: RegisterRequest): Observable<User>` - Creates new user
- `logout(): void` - Clears session
- `generateId(): string` - Generates unique IDs
- `isLoggedIn`: Computed signal for auth state
- `currentUser`: Computed signal for current user

**Usage Example:**
```typescript
// In LoginComponent
this.authService.login(loginData).subscribe(user => {
  this.router.navigate(['/recipes']);
});
```

---

### ✅ Service 2: **RecipeService**
**Location:** `src/app/shared/services/recipe.service.ts`

**Methods:**
- `getAllRecipies(): Observable<Recipe[]>` - Fetches all recipes with related data
- `getRecipeById(id: string): Observable<Recipe>` - Fetches single recipe
- `addRecipes(recipe: Recipe): Observable<Recipe>` - Creates new recipe
- `updateRecipe(recipe: Recipe): Observable<Recipe>` - Updates existing recipe
- `deleteRecipe(id: string): Observable<any>` - Deletes recipe
- `getAllCategories(): Observable<Category[]>` - Fetches categories
- `getAllIngredients(): Observable<Ingredient[]>` - Fetches ingredients

**Usage Example:**
```typescript
// In RecipeDetailsComponent
this.recipeService.getRecipeById(id).subscribe(recipe => {
  this.recipe = recipe;
});
```

**Code Reference:**
- AuthService: `src/app/shared/services/auth.service.ts:1-80`
- RecipeService: `src/app/shared/services/recipe.service.ts:1-120`

---

## 🌐 HTTP Communication (Backend with 3+ tables)

### Requirement: Communication with backend (json-server), minimum 3 tables

**Backend Configuration:** `backend/db.json`

**Database Structure (4 tables):**

### ✅ Table 1: **users**
```json
"users": [
  {
    "id": "1",
    "username": "john_doe",
    "password": "password123",
    "email": "john@example.com"
  }
]
```
**Endpoints:**
- `GET /users` - Query users (used for login)
- `POST /users` - Create new user (used for registration)

---

### ✅ Table 2: **categories**
```json
"categories": [
  {
    "id": "1",
    "name": "Breakfast"
  },
  {
    "id": "2",
    "name": "Lunch"
  }
]
```
**Endpoints:**
- `GET /categories` - Fetch all categories
- Used in: Recipe form dropdown, Recipe filter

---

### ✅ Table 3: **ingredients**
```json
"ingredients": [
  {
    "id": "1",
    "name": "Flour",
    "unit": "g"
  },
  {
    "id": "2",
    "name": "Sugar",
    "unit": "g"
  }
]
```
**Endpoints:**
- `GET /ingredients` - Fetch all ingredients
- Used in: Recipe form, Recipe details display

---

### ✅ Table 4: **recipes**
```json
"recipes": [
  {
    "id": "1",
    "name": "Pasta Carbonara",
    "categoryId": "2",
    "description": "Italian classic pasta",
    "prepTime": 15,
    "cookTime": 20,
    "difficulty": "medium",
    "imageURL": "...",
    "ingredients": [
      { "ingredientId": "1", "quantity": 500 }
    ],
    "steps": [
      { "order": 1, "description": "..." }
    ],
    "userId": "1",
    "createdAt": "2024-01-01"
  }
]
```
**Endpoints:**
- `GET /recipes` - Fetch all recipes
- `GET /recipes/:id` - Fetch single recipe
- `POST /recipes` - Create new recipe
- `PUT /recipes/:id` - Update recipe
- `DELETE /recipes/:id` - Delete recipe

---

**HTTP Communication Flow:**

| Operation | Method | Endpoint | Status |
|-----------|--------|----------|--------|
| User Login | GET | `/users?username=...` | ✅ Implemented |
| User Register | POST | `/users` | ✅ Implemented |
| List Recipes | GET | `/recipes` | ✅ Implemented |
| Get Recipe | GET | `/recipes/:id` | ✅ Implemented |
| Create Recipe | POST | `/recipes` | ✅ Implemented |
| Update Recipe | PUT | `/recipes/:id` | ✅ Implemented |
| Delete Recipe | DELETE | `/recipes/:id` | ✅ Implemented |
| Get Categories | GET | `/categories` | ✅ Implemented |
| Get Ingredients | GET | `/ingredients` | ✅ Implemented |

**Code Reference:**
- HttpClient setup: `src/app/app.config.ts:5-12`
- AuthService HTTP calls: `src/app/shared/services/auth.service.ts:30-50`
- RecipeService HTTP calls: `src/app/shared/services/recipe.service.ts:20-100`
- Backend data: `backend/db.json`

**To run the backend:**
```bash
npx json-server --watch backend/db.json
```

---

## 📝 Reactive Forms (Minimum 3 FormControl + Custom Validator)

### Requirement: Minimum 3 FormControl in forms (plus auth forms), with custom validator

### ✅ Form 1: **Login Form** (2 FormControl)
**Location:** `src/app/login/login.component.ts`

```typescript
loginForm: FormGroup = this.fb.group({
  username: ['', [Validators.required, Validators.minLength(3)]],  // FormControl 1
  password: ['', [Validators.required, Validators.minLength(3)]],  // FormControl 2
});
```

---

### ✅ Form 2: **Register Form** (3+ FormControl + Custom Validator)
**Location:** `src/app/register/register.component.ts`

```typescript
registerForm: FormGroup = this.fb.group(
  {
    username: ['', [Validators.required, Validators.minLength(3)]],    // FormControl 1
    password: ['', [Validators.required, Validators.minLength(3)]],    // FormControl 2
    confirmPassword: ['', [Validators.required]],                       // FormControl 3
  },
  { validators: this.passwordMatchValidator }  // ✅ Custom Validator
);
```

**Custom Validator Implementation:**
```typescript
passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
  const passwordControl = formGroup.get('password');
  const confirmPasswordControl = formGroup.get('confirmPassword');

  if (!passwordControl || !confirmPasswordControl) {
    return null;
  }

  if (passwordControl.value !== confirmPasswordControl.value) {
    confirmPasswordControl.setErrors({ 'passwordMismatch': true });
    return { 'passwordMismatch': true };
  } else {
    confirmPasswordControl.setErrors(null);
    return null;
  }
}
```

**Code Reference:**
- Custom validator: `src/app/register/register.component.ts:45-60`
- Validator usage: `src/app/register/register.component.ts:22-32`

---

### ✅ Form 3: **Recipe Form** (6+ FormControl + FormArray)
**Location:** `src/app/recipe-form/recipe-form.component.ts`

```typescript
recipeForm: FormGroup = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],           // FormControl 1
  categoryId: ['', [Validators.required]],                              // FormControl 2
  description: ['', [Validators.required, Validators.minLength(10)]],   // FormControl 3
  prepTime: ['', [Validators.required, Validators.min(1)]],             // FormControl 4
  cookTime: ['', [Validators.required, Validators.min(1)]],             // FormControl 5
  difficulty: ['', [Validators.required]],                              // FormControl 6
  imageURL: ['', [Validators.required]],                                // FormControl 7
  ingredients: this.fb.array([]),    // FormArray for dynamic ingredients
  steps: this.fb.array([]),          // FormArray for dynamic steps
});
```

**Exceeds Requirement:** 7 FormControl + 2 FormArray (total 9 controls)

**FormArray Management:**
```typescript
get ingredients(): FormArray {
  return this.recipeForm.get('ingredients') as FormArray;
}

addIngredient(): void {
  this.ingredients.push(this.createIngredientControl());
}

removeIngredient(index: number): void {
  this.ingredients.removeAt(index);
}
```

**Code Reference:**
- Recipe form: `src/app/recipe-form/recipe-form.component.ts:20-50`
- FormArray management: `src/app/recipe-form/recipe-form.component.ts:80-110`
- Form submission: `src/app/recipe-form/recipe-form.component.ts:115-140`

---

## 🎨 Custom Pipe (Minimum 1)

### Requirement: At least 1 custom pipe for data transformation

### ✅ **CookingTimePipe**
**Location:** `src/app/shared/pipes/cooking-time.pipe.ts`

**Purpose:** Converts minutes to human-readable time format

**Implementation:**
```typescript
@Pipe({
  name: 'cookingTime',
  standalone: true
})
export class CookingTimePipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }

    const minutes = Number(value);

    if (isNaN(minutes) || minutes < 0) {
      return 'Invalid time';
    }

    if (minutes === 0) {
      return '0 min';
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}min`;
    }
  }
}
```

**Usage Examples:**
```html
<!-- In recipe details template -->
<p>Prep Time: {{ recipe.prepTime | cookingTime }}</p>
<p>Cook Time: {{ recipe.cookTime | cookingTime }}</p>

<!-- Output Examples -->
<!-- 30 → "30 min" -->
<!-- 120 → "2h" -->
<!-- 90 → "1h 30min" -->
```

**Used in:**
- `src/app/recipe/recipe-details/recipe-details.component.html` - Display prep/cook times
- `src/app/recipe/recipes/recipes.component.html` - Recipe list view
- `src/app/shared/ui/recipe-card/recipe-card.component.html` - Recipe cards

**Code Reference:**
- Pipe implementation: `src/app/shared/pipes/cooking-time.pipe.ts:1-40`
- Pipe usage: `src/app/recipe/recipe-details/recipe-details.component.html:15-18`

---

## 📌 Custom Directive (Minimum 1)

### Requirement: At least 1 custom directive for DOM manipulation

### ✅ **HighlightIngredientDirective**
**Location:** `src/app/shared/directives/highlight-ingredient.directive.ts`

**Purpose:** Highlights ingredient items on hover for better UX

**Implementation:**
```typescript
@Directive({
  selector: '[appHighlightIngredient]',
  standalone: true,
})
export class HighlightIngredientDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onHover(): void {
    this.el.nativeElement.style.backgroundColor = '#fff3cd'; // Light yellow
    this.el.nativeElement.style.cursor = 'pointer';
    this.el.nativeElement.style.transition = 'all 0.2s ease';
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.el.nativeElement.style.backgroundColor = '#f3f4f6'; // Light gray
  }
}
```

**Usage Example:**
```html
<!-- In recipe-details template -->
<div class="ingredients-list">
  <div *ngFor="let ingredient of recipe.ingredients"
       appHighlightIngredient
       class="ingredient-item">
    {{ ingredient.name }} - {{ ingredient.quantity }}
  </div>
</div>
```

**Features:**
- ✅ Responds to mouse enter/leave events
- ✅ Changes background color for visual feedback
- ✅ Improves UX by highlighting interactive elements
- ✅ Uses `@HostListener` decorator for event handling
- ✅ Standalone directive (works with standalone components)

**Used in:**
- `src/app/recipe/recipe-details/recipe-details.component.html` - Ingredient list items

**Code Reference:**
- Directive: `src/app/shared/directives/highlight-ingredient.directive.ts:1-30`
- Usage: `src/app/recipe/recipe-details/recipe-details.component.html:25-30`

---

## 📊 Requirements Completion Summary

| Requirement | Type | Count | Status | Evidence |
|------------|------|-------|--------|----------|
| **Authentication** | Sign up/in | 2 forms | ✅ Complete | LoginComponent, RegisterComponent |
| **Routes** | Route definitions | 7 | ✅ Complete (3+ required) | app.routes.ts |
| **Route Parameters** | Data transmission | 2 | ✅ Complete (1+ required) | `:id` in recipes/:id and :id/edit |
| **Components** | Per page | 6 | ✅ Complete (1+ required) | HomeComponent through RecipeFormComponent |
| **Reused Components** | Used 2+ times | 3 | ✅ Complete (1+ required) | RecipeCardComponent, ButtonComponent, InputComponent |
| **@Input Decorator** | Component input | 1+ | ✅ Complete | RecipeCardComponent.recipe |
| **@Output Decorator** | Component output | 2+ | ✅ Complete | RecipeCardComponent.deleteRecipe, editRecipe |
| **Services** | Service classes | 2 | ✅ Complete | AuthService, RecipeService |
| **HTTP Methods** | REST operations | 9 | ✅ Complete | GET, POST, PUT, DELETE on various endpoints |
| **Database Tables** | Backend tables | 4 | ✅ Complete (3+ required) | users, categories, ingredients, recipes |
| **Reactive Forms** | FormControl count | 9 | ✅ Complete (3+ required) | Login (2), Register (3), RecipeForm (6+) |
| **Custom Validator** | Form validation | 1 | ✅ Complete | passwordMatchValidator in RegisterForm |
| **Custom Pipe** | Data transformation | 1 | ✅ Complete | CookingTimePipe |
| **Custom Directive** | DOM manipulation | 1 | ✅ Complete | HighlightIngredientDirective |

---

## 🚀 How to Run

```bash
# Install dependencies
npm install

# Start the backend (in another terminal)
npx json-server --watch backend/db.json

# Start the Angular development server
ng serve

# Navigate to http://localhost:4200/
```

---

## 📁 Project Structure

```
cooking-app/
├── src/
│   ├── app/
│   │   ├── shared/
│   │   │   ├── directives/
│   │   │   │   └── highlight-ingredient.directive.ts    ✅ Custom Directive
│   │   │   ├── pipes/
│   │   │   │   └── cooking-time.pipe.ts                 ✅ Custom Pipe
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts                      ✅ Service 1
│   │   │   │   └── recipe.service.ts                    ✅ Service 2
│   │   │   └── ui/
│   │   │       ├── button/
│   │   │       ├── input/
│   │   │       └── recipe-card/                         ✅ Reused Component
│   │   ├── login/                                       ✅ Auth Component
│   │   ├── register/                                    ✅ Auth Component
│   │   ├── home/                                        ✅ Home Component
│   │   ├── recipe/
│   │   │   ├── recipes/                                 ✅ Recipes List Component
│   │   │   └── recipe-details/                          ✅ Recipe Details Component (with :id route)
│   │   ├── recipe-form/                                 ✅ Form Component (with Reactive Forms)
│   │   ├── app.routes.ts                                ✅ Routing Configuration
│   │   └── app.config.ts                                ✅ HTTP Client Setup
│   └── styles.css
├── backend/
│   └── db.json                                          ✅ Backend Database (4 tables)
├── angular.json
├── package.json
└── tsconfig.json
```

---

## ✨ Key Technologies Used

- **Angular 19.2.0** - Frontend framework
- **TypeScript** - Language
- **RxJS** - Reactive programming
- **Angular Signals** - State management
- **Reactive Forms** - Form handling
- **HttpClient** - HTTP communication
- **JSON Server** - Backend mock database
- **Angular Router** - Routing and navigation
- **Standalone Components** - Modern Angular architecture

---

## 🎓 Educational Value

This project demonstrates:
- ✅ Complete authentication flow
- ✅ Full CRUD operations with HTTP
- ✅ Advanced form handling with FormArray
- ✅ Custom validators and error handling
- ✅ Reusable components with @Input/@Output
- ✅ Service-based architecture
- ✅ Angular routing with guards
- ✅ Custom pipes and directives
- ✅ Modern state management with Signals
- ✅ Professional code organization
