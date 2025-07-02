import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DashboardComponent } from "./pages/dashboard/dashboard.component";

@Component({
  selector: 'app-root',
  imports: [CommonModule, DashboardComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Habits';
}
