import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HabitSummary } from '../interfaces/habit-summary';
import { environment } from '../../environments/environment';

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
export class SummaryService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getSummary(startDate: string, endDate: string): Observable<HabitSummary[]> {
    return this.http.get<HabitSummary[]>(`${this.apiUrl}/summary/${startDate}/${endDate}`);
  }

  getHabitsByDate(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary/day`);
  }
}
