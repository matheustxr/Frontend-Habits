import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { HabitFormComponent } from "../habit-form/habit-form.component";
import { LoginFormComponent } from '../login-form/login-form.component';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component'; // Importe o novo componente
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    HabitFormComponent,
    LoginFormComponent,
    CreateAccountFormComponent
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  displayModal = false;
  modalHeader = '';
  showCreateAccountForm = false;

  constructor(public authService: AuthService) {}

  showModal(): void {
    console.log('Usuário está logado?', this.authService.isLoggedIn());
    if (this.authService.isLoggedIn()) {
      this.modalHeader = 'Criar hábito';
    } else {
      this.showCreateAccountForm = false;
      this.modalHeader = 'Entrar';
    }
    this.displayModal = true;
  }

  toggleFormView(): void {
    this.showCreateAccountForm = !this.showCreateAccountForm;
    this.modalHeader = this.showCreateAccountForm ? 'Criar Conta' : 'Entrar';
  }
}
