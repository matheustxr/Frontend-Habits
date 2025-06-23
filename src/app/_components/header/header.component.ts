import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { NewHabitFormComponent } from "../new-habit-form/new-habit-form.component";

@Component({
  selector: 'app-header',
  imports: [DialogModule, ButtonModule, NewHabitFormComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  displayModal = false;

  showModal() {
    this.displayModal = true;
  }
}
