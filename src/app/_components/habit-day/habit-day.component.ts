import { Component, Input, ViewChild } from '@angular/core';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';
import { HabitsListComponent } from '../habits-list/habits-list.component';
import { ProgressBarComponent } from "../progress-bar/progress-bar.component";

@Component({
  selector: 'app-habit-day',
  imports: [CommonModule, PopoverModule, ButtonModule, HabitsListComponent, ProgressBarComponent],
  templateUrl: './habit-day.component.html',
})
export class HabitDayComponent {
  @Input() date!: Date;
  @Input() defaultCompleted = 0;
  @Input() amount = 0;

  completed = 0;

  ngOnChanges() {
    this.completed = this.defaultCompleted;
  }

  get completedPercentage(): number {
    return this.amount > 0 ? Math.round((this.completed / this.amount) * 100) : 0;
  }

  get dayAndMonth(): string {
    return dayjs(this.date).format('DD/MM');
  }

  get dayOfWeek(): string {
    return dayjs(this.date).format('dddd');
  }

  handleCompletedChanged(value: number) {
    this.completed = value;
  }
}
