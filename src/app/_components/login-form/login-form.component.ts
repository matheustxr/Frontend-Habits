import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TextInputComponent } from '../text-input/text-input.component';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../interfaces/auth.interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [ FormsModule,TextInputComponent],
  templateUrl: './login-form.component.html',
  styles: ``
})
export class LoginFormComponent {
  credentials: LoginCredentials = {
    email: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = null;

    this.authService.login(this.credentials).subscribe({
      next: () => {
        console.log('Login realizado com sucesso!');
        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        console.error('Falha no login:', err);
        this.errorMessage = 'Email ou senha inválidos. Tente novamente.';
      }
    });
  }
}
