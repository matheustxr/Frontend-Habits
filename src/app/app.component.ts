import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./pages/dashboard/dashboard.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, DashboardComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Habits';
}
