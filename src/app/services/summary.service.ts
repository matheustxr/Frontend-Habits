import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HabitSummary } from '../interfaces/habit-summary';
import { environment } from '../../environments/environment';
import { HabitDayResponse } from '../interfaces/habit-day-response';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getSummary(startDate: string, endDate: string): Observable<HabitSummary[]> {
    return this.http.get<HabitSummary[]>(`${this.apiUrl}/summary/${startDate}/${endDate}`);
  }

  getHabitsByDate(date: string): Observable<HabitDayResponse[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<HabitDayResponse[]>(`${this.apiUrl}/summary/day`, { params });
  }
}
