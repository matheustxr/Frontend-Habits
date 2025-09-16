import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChangePasswordRequest, UserProfile } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl);
  }

  updateUserProfile(data: UserProfile): Observable<void> {
    return this.http.put<void>(this.apiUrl, data);
  }

  changePassword(data: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/change-password`, data);
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }
}
