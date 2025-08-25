import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginCredentials, LoginResponse } from '../interfaces/auth.interfaces';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.cookieService.set('authToken', response.token, 7);

          if (response.name) {
             localStorage.setItem('userName', response.name);
          }
        }
      })
    );
  }

  logout(): void {
    this.cookieService.delete('authToken');
    localStorage.removeItem('userName');
  }

  getToken(): string | null {
    return this.cookieService.get('authToken') || null;
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('authToken');
  }
}
