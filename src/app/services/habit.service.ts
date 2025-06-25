import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HabitSummary } from '../models/habit.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private baseUrl = 'http://localhost:3333';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<HabitSummary[]> {
    const response = this.http.get<HabitSummary[]>(`${this.baseUrl}/summary`);
    console.log(response)
    return response;
  }

  createHabit(title: string, weekDays: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/habits`, {
      title,
      weekDays
    });
  }
}
