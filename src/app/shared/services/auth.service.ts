import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../models/user';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000';
  private http = inject(HttpClient);

  private currentUserSignal = signal<User | null>(null);

  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  currentUser = computed(() => this.currentUserSignal());

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSignal.set(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const params = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password);

    return this.http.get<User[]>(`${this.API_URL}/users`, { params }).pipe(
      map((users) => {
        if (users && users.length > 0) {
          const user = users[0];
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSignal.set(user);
          return { success: true, user };
        } else {
          return {
            success: false,
            message: "Nom d'utilisateur ou mot de passe incorrect",
          };
        }
      }),
      catchError((error) => {
        console.error('Erreur lors de la connexion:', error);
        return of({
          success: false,
          message: 'Erreur de connexion au serveur',
        });
      }),
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    const params = new HttpParams().set('username', userData.username);

    return this.http.get<User[]>(`${this.API_URL}/users`, { params }).pipe(
      switchMap((existingUsers) => {
        if (existingUsers && existingUsers.length > 0) {
          return of({
            success: false,
            message: "Ce nom d'utilisateur est déjà utilisé",
          });
        }

        const newUser: User = {
          id: this.generateId(),
          username: userData.username,
          password: userData.password,
        };

        return this.http.post<User>(`${this.API_URL}/users`, newUser).pipe(
          map((user) => {
            const userWithoutPassword = { ...user, password: '' };
            localStorage.setItem(
              'currentUser',
              JSON.stringify(userWithoutPassword),
            );
            this.currentUserSignal.set(userWithoutPassword);
            return { success: true, user: userWithoutPassword };
          }),
          catchError((error) => {
            console.error("Erreur lors de l'enregistrement:", error);
            return of({
              success: false,
              message: "Erreur lors de l'enregistrement",
            });
          }),
        );
      }),
      catchError((error) => {
        console.error(
          "Erreur lors de la vérification de l'utilisateur:",
          error,
        );
        return of({
          success: false,
          message: 'Erreur de connexion au serveur',
        });
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
