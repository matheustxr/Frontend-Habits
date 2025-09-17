import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { LoginFormComponent } from '../login-form/login-form.component';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { AppEventsService } from '../../services/app-events.service';
import { ProfileFormComponent } from '../profile-form/profile-form.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    LoginFormComponent,
    CreateAccountFormComponent,
    MenuModule,
    ProfileFormComponent,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  displayModal = false;
  modalHeader = 'Entrar';
  showCreateAccountForm = false;
  private eventsSubscription!: Subscription;
  modalContent: 'auth' | 'habit' | 'profile' | null = null;

  userName: string | null = null;
  userMenuItems: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private appEventsService: AppEventsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventsSubscription = this.appEventsService.formSuccess$.subscribe(() => {
      this.displayModal = false;
      this.updateUserInfo();
    });

    this.updateUserInfo();
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }

  updateUserInfo(): void {
    if (this.authService.isLoggedIn()) {
      this.userName = localStorage.getItem('userName');
      this.setupUserMenu();
    } else {
      this.userName = null;
    }
  }

  setupUserMenu(): void {
    this.userMenuItems = [
      {
        label: 'Meu Perfil',
        icon: 'pi pi-fw pi-user-edit',
        command: () => this.showProfileModal()
      },
      {
        label: 'Alterar Senha',
        icon: 'pi pi-fw pi-key',
        command: () => this.router.navigate(['/change-password'])
      },
      { separator: true },
      {
        label: 'Sair',
        icon: 'pi pi-fw pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout(): void {
    this.authService.logout();
    this.updateUserInfo();
    this.router.navigate(['/']);
  }

  showAuthModal(): void {
    this.modalContent = 'auth';
    this.modalHeader = 'Entrar';
    this.showCreateAccountForm = false;
    this.displayModal = true;
  }

  showProfileModal(): void {
    this.modalContent = 'profile';
    this.modalHeader = 'Meu Perfil';
    this.displayModal = true;
  }

  toggleFormView(): void {
    this.showCreateAccountForm = !this.showCreateAccountForm;
    this.modalHeader = this.showCreateAccountForm ? 'Criar Conta' : 'Entrar';
  }
}
