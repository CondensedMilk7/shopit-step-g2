import { Injectable } from '@angular/core';
import { ENVIRONMENT } from 'src/environment/environment';
import { User, UserCredentials } from '../types/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  baseUrl = ENVIRONMENT.baseUrl;

  private loading$ = new BehaviorSubject<boolean>(false);
  private errorMsg$ = new BehaviorSubject<string>('');
  private user$ = new BehaviorSubject<User | null>(null);

  get loading() {
    return this.loading$.asObservable();
  }

  get errorMsg() {
    return this.errorMsg$.asObservable();
  }

  get user() {
    return this.user$.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) {}

  init() {
    const userStr = localStorage.getItem(ENVIRONMENT.userKey);
    if (userStr) {
      this.user$.next(JSON.parse(userStr));
    }
  }

  signIn(credentials: UserCredentials) {
    this.loading$.next(true);
    return this.http.post<User>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.loading$.next(false);
        this.user$.next(response);
        localStorage.setItem(ENVIRONMENT.userKey, JSON.stringify(response));
        localStorage.setItem(ENVIRONMENT.tokenKey, response.token);
        this.router.navigate(['/shop']);
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorMsg$.next(error.error.message);
        this.loading$.next(false);
        return of(false);
      })
    );
  }

  signOut() {
    localStorage.removeItem(ENVIRONMENT.userKey);
    localStorage.removeItem(ENVIRONMENT.tokenKey);
    this.user$.next(null);
  }

  getUserId() {
    const userStr = localStorage.getItem(ENVIRONMENT.userKey);

    if (userStr) {
      const user = JSON.parse(userStr) as User;
      return user.id;
    }

    return null;
  }

  getToken() {
    return localStorage.getItem(ENVIRONMENT.tokenKey);
  }
}
