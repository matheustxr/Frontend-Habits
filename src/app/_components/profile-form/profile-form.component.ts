import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from '../text-input/text-input.component';
import { AppEventsService } from '../../services/app-events.service';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../interfaces/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-form',
  imports: [CommonModule, FormsModule, TextInputComponent],
  templateUrl: './profile-form.component.html',
})

export class ProfileFormComponent implements OnInit {
  userData: UserProfile = { name: '', email: '' };
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private userService: UserService,
    private appEventsService: AppEventsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userData = profile;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível carregar os dados do perfil.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.userService.updateUserProfile(this.userData).subscribe({
      next: () => {
        this.successMessage = 'Perfil atualizado com sucesso!';
        this.isLoading = false;

        this.authService.updateStoredUserName(this.userData.name);

        this.appEventsService.notifyFormSuccess();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao atualizar o perfil.';
        this.isLoading = false;
      }
    });
  }
}
