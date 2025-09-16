import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs'; // Adicione BehaviorSubject
import { environment } from '../../environments/environment';
import { LoginCredentials, LoginResponse } from '../interfaces/auth.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private readonly TOKEN_EXPIRATION_MINUTES = 1440;

  private userNameSubject = new BehaviorSubject<string | null>(this.getUserName());
  public userName$ = this.userNameSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  createAccount(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/user`, credentials).pipe(
      tap(response => this._setSession(response))
    );
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this._setSession(response))
    );
  }

  logout(): void {
    this.cookieService.delete('authToken');
    localStorage.removeItem('userName');
    this.userNameSubject.next(null);
  }

  getToken(): string | null {
    return this.cookieService.get('authToken') || null;
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('authToken');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  updateStoredUserName(newName: string): void {
    localStorage.setItem('userName', newName);
    this.userNameSubject.next(newName);
  }

  private _setSession(response: LoginResponse): void {
    if (response && response.token) {
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + this.TOKEN_EXPIRATION_MINUTES);

      this.cookieService.set('authToken', response.token, expirationDate);

      if (response.name) {
        this.updateStoredUserName(response.name);
      }
    }
  }
}
