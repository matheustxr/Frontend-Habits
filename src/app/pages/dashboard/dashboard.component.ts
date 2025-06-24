import { Component } from '@angular/core';
import { HeaderComponent } from "../../_components/header/header.component";
import { ProgressBarComponent } from "../../_components/progress-bar/progress-bar.component";

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, ProgressBarComponent],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {
  weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]

}
