import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HabitSummary } from '../interfaces/habit-summary';

interface HabitsForDayResponse {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
}

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private baseUrl = 'http://localhost:3333';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<HabitSummary[]> {
    return this.http.get<HabitSummary[]>(`${this.baseUrl}/summary`);
  }

  getHabitsByDate(dateISO: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/day`, {
    params: { date: dateISO }
  });
}

toggleHabit(habitId: string): Observable<any> {
  return this.http.patch(`${this.baseUrl}/habits/${habitId}/toggle`, {});
}

  createHabit(title: string, weekDays: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/habits`, {
      title,
      weekDays
    });
  }
}
