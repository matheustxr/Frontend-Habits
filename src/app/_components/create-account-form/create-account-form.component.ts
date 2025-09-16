import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreateAccountCredentials } from '../../interfaces/auth.model';
import { AuthService } from '../../services/auth.service';
import { TextInputComponent } from "../text-input/text-input.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-create-account-form',
  imports: [FormsModule, TextInputComponent],
  templateUrl: './create-account-form.component.html',
})
export class CreateAccountFormComponent {
  credentials: CreateAccountCredentials = {
    name: '',
    email: '',
    password: ''
  };

  confirmPassword = '';
  errorMessage: string | null = null;
  passwordStrengthError: string | null = null;
  isPasswordFocused = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = null;
    this.passwordStrengthError = null;

    if (this.credentials.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não correspondem.';
      return;
    }

    if (!this.isPasswordStrong(this.credentials.password)) {
      this.passwordStrengthError = 'A senha não atende aos requisitos de segurança.';
      return;
    }

    this.authService.createAccount(this.credentials).subscribe({
      next: () => {
        console.log('Conta criada com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Falha ao criar conta:', err);
        this.errorMessage = err.error?.message || 'Erro ao criar a conta. Verifique os dados e tente novamente.';
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
