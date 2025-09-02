import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SummaryService } from '../../services/summary.service';
import { HabitSummary } from '../../interfaces/habit-summary';
import { HabitDayComponent } from '../../_components/habit-day/habit-day.component';
import { HeaderComponent } from "../../_components/header/header.component";
import dayjs from 'dayjs';
import { Dialog } from "primeng/dialog";
import { HabitFormComponent } from "../../_components/habit-form/habit-form.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, HabitDayComponent, HeaderComponent, Dialog, HabitFormComponent],
  templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements OnInit {
  weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  habitToEdit: any | null = null;
  displayModal = false;

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();

  dates: Date[] = [];
  leadingEmptyDays: number[] = [];
  summary: HabitSummary[] = [];

  constructor(private summaryService: SummaryService) {}

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

    const startDate = dayjs(this.dates[0]).format('YYYY-MM-DD');
    const endDate = dayjs(this.dates[this.dates.length - 1]).format('YYYY-MM-DD');

    this.summaryService.getSummary(startDate, endDate).subscribe((data) => {
      this.summary = data;
    });
  }

  onMonthChange(value: number): void {
    this.currentMonth = value;
    this.updateCalendar();
  }

  onYearChange(value: number): void {
    this.currentYear = value;
    this.updateCalendar();
  }

  getDayData(date: Date): HabitSummary | undefined {
    return this.summary.find((day) =>
      dayjs(day.date).isSame(date, 'day')
    );
  }

  onHabitSaved() {
    this.updateCalendar();
    this.displayModal = false;
  }

  onEditHabit(habit: any) {
    this.habitToEdit = habit;
    this.displayModal = true;
  }
}
