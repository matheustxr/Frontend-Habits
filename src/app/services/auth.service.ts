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
  private readonly TOKEN_EXPIRATION_MINUTES = 1440;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          const expirationDate = new Date();
          expirationDate.setMinutes(expirationDate.getMinutes() + this.TOKEN_EXPIRATION_MINUTES);

          this.cookieService.set('authToken', response.token, expirationDate);

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
