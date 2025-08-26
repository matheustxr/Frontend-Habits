import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Habit } from '../interfaces/habit';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  createHabit(data: Habit): Observable<any> {
    return this.http.post(`${this.apiUrl}/habits`, data);
  }

  getAllHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(`${this.apiUrl}/habits`);
  }

  getHabitById(id: string): Observable<Habit> {
    return this.http.get<Habit>(`${this.apiUrl}/habits/${id}`);
  }

  deleteHabit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/habits/${id}`);
  }

  updateHabit(id: string, data: Partial<Habit>): Observable<Habit> {
    return this.http.put<Habit>(`${this.apiUrl}/habits/${id}`, data);
  }

  toggleHabit(habitId: string, date: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/habits/${habitId}/toggle/${date}`, {});
  }
}
