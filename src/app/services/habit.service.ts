import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Habit, HabitRequest, HabitsResponse } from '../interfaces/habit.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private apiUrl = `${environment.apiUrl}/habits`;

  constructor(private http: HttpClient) {}

  getAllHabits(): Observable<Habit[]> {
    return this.http.get<HabitsResponse>(this.apiUrl).pipe(
      map(response => response.habits || [])
    );
  }

  getHabitById(id: number | string): Observable<Habit> {
    return this.http.get<Habit>(`${this.apiUrl}/${id}`);
  }

  createHabit(data: HabitRequest): Observable<Habit> {
    return this.http.post<Habit>(this.apiUrl, data);
  }

  updateHabit(id: number | string, data: HabitRequest): Observable<Habit> {
    return this.http.put<Habit>(`${this.apiUrl}/${id}`, data);
  }

  deleteHabit(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleHabitCompletion(habitId: number, date: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${habitId}/toggle/${date}`, {});
  }
}
