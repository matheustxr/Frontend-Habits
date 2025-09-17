import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from '../text-input/text-input.component';
import { UserService } from '../../services/user.service';
import { AppEventsService } from '../../services/app-events.service';

@Component({
  selector: 'app-change-password-form',
  imports: [CommonModule, FormsModule, TextInputComponent],
  templateUrl: './change-password-form.component.html',
  styles: ``
})
export class ChangePasswordFormComponent {
  passwords = {
    current: '',
    new: '',
    confirm: ''
  };
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isPasswordFocused = false;

  constructor(
    private userService: UserService,
    private appEventsService: AppEventsService
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.passwords.new !== this.passwords.confirm) {
      this.errorMessage = 'A nova senha e a confirmação não correspondem.';
      this.isLoading = false;
      return;
    }

    if (!this.isPasswordStrong(this.passwords.new)) {
      this.errorMessage = 'A nova senha não atende aos requisitos de segurança.';
      this.isLoading = false;
      return;
    }

    const request = {
      password: this.passwords.current,
      newPassword: this.passwords.new
    };

    this.userService.changePassword(request).subscribe({
      next: () => {
        this.successMessage = 'Senha alterada com sucesso!';
        this.isLoading = false;

        setTimeout(() => this.appEventsService.notifyFormSuccess(), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao alterar a senha. Verifique sua senha atual.';
        this.isLoading = false;
      }
    });
  }

  private isPasswordStrong(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }
}
