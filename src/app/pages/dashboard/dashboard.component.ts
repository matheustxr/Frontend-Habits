import { Component } from '@angular/core';
import { HeaderComponent } from "../../_components/header/header.component";
import { ProgressBarComponent } from "../../_components/progress-bar/progress-bar.component";
import { HabitDayComponent } from "../../_components/habit-day/habit-day.component";

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, ProgressBarComponent, HabitDayComponent],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {
  weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]

  mockDate = new Date(2025, 5, 21);
}
