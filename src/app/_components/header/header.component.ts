import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe CommonModule ou NgIf
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { NewHabitFormComponent } from "../new-habit-form/new-habit-form.component";
import { LoginFormComponent } from '../login-form/login-form.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    NewHabitFormComponent,
    LoginFormComponent
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  displayModal = false;
  modalHeader = '';

  constructor(public authService: AuthService) {}

  showModal() {
    if (this.authService.isLoggedIn()) {
      this.modalHeader = 'Criar hábito';
    } else {
      this.modalHeader = '';
    }

    // Abre o modal
    this.displayModal = true;
  }
}
