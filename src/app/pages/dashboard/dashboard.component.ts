import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitService } from '../../services/habit.service';
import { HabitSummary } from '../../interfaces/habit-summmary';
import { HabitDayComponent } from '../../_components/habit-day/habit-day.component';
import { HeaderComponent } from "../../_components/header/header.component";
import dayjs from 'dayjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, HabitDayComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();

  dates: Date[] = [];
  leadingEmptyDays: number[] = [];
  summary: HabitSummary[] = [];

  constructor(private habitService: HabitService) {}

  ngOnInit(): void {
    this.updateCalendar();
  }

  private generateDatesFromMonth(year: number, month: number): Date[] {
    const firstDay = dayjs(new Date(year, month, 1));
    const lastDay = firstDay.endOf('month');
    const dates: Date[] = [];

    let current = firstDay;
    while (current.isBefore(lastDay) || current.isSame(lastDay, 'day')) {
      dates.push(current.toDate());
      current = current.add(1, 'day');
    }

    return dates;
  }

  updateCalendar(): void {
    this.dates = this.generateDatesFromMonth(this.currentYear, this.currentMonth);
    this.leadingEmptyDays = this.dates.length
      ? Array.from({ length: dayjs(this.dates[0]).day() })
      : [];

    this.habitService.getSummary().subscribe((data) => {
      this.summary = data;
    });
  }

  onMonthChange(event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value, 10);
    this.currentMonth = value;
    this.updateCalendar();
  }

  onYearChange(event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value, 10);
    this.currentYear = value;
    this.updateCalendar();
  }

  getDayData(date: Date): HabitSummary | undefined {
    return this.summary.find((day) =>
      dayjs(day.date).isSame(date, 'day')
    );
  }
}
