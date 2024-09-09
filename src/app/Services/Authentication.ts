import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7089/api'; 
  private tokenExpirationTimer: any;
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    setTimeout(() => {
      this.checkToken();
    }, 0); // delays execution until after initial setup so that local storage can initialise

  }
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Auth/Login`, { email, password })
      .pipe(
        tap(response => {
          this.setSession(response);
          this._isLoggedIn.next(true);
        }),
        catchError(this.handleError)
      );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Auth/Register`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<any>(`${this.apiUrl}/Auth/Refresh`, { refreshToken })
      .pipe(
        tap(response => this.setSession(response)),
        catchError(this.handleError)
      );
  }

  private setSession(authResult: any) {
    const expiresAt = new Date().getTime() + 15*60*1000;
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('refresh_token', authResult.refreshToken);
    localStorage.setItem('expires_at', expiresAt.toString());
    localStorage.setItem('user_id', authResult.userId.toString());
    this.setTokenExpirationTimer();
  }

  private setTokenExpirationTimer() {
    const expiresAt = localStorage.getItem('expires_at');
    const expiresIn = expiresAt ? new Date(parseInt(expiresAt)).getTime() - new Date().getTime() : 0;
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      alert('Your session has expired. Please log in again.');
    }, expiresIn);
  }

  private checkToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const expiresAt = localStorage.getItem('expires_at');
      const now = new Date().getTime();
      if (expiresAt && parseInt(expiresAt) > now) {
        this._isLoggedIn.next(true);
        this.setTokenExpirationTimer();
      } else {
        this.logout();
      }
    }
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
  
    // Check if the error indicates that the user already exists
    if (error.status === 400 && error.error.message === 'User already exists') {
      return throwError(() => new Error('User already exists on the system.'));
    }
  
    // Default error message
    return throwError(() => new Error('User already exists on the system.'));
  }
  getResetToken(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/User/get-reset-token/${email}`);
  }

  // Method to reset password
  resetPassword(email: string, emailToken: string, newPassword: string): Observable<any> {
    const payload = {
      email,
      emailToken,
      newPassword
    };
    return this.http.post(`${this.apiUrl}/User/Reset-password`, payload);
  }

 
}
