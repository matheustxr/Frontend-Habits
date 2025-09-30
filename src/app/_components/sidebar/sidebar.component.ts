import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppEventsService } from '../../services/app-events.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  mainNavLinks = [
    { label: 'Dashboard', icon: 'pi pi-th-large', routerLink: '/dashboard' },
    { label: 'Meus Hábitos', icon: 'pi pi-clone', routerLink: '/manage/habits' },
    { label: 'Categorias', icon: 'pi pi-tags', routerLink: '/manage/categories' },
  ];

  settingsActions = [
    { label: 'Meu Perfil', icon: 'pi pi-user-edit', action: () => this.appEventsService.requestModal('profile') },
    { label: 'Alterar Senha', icon: 'pi pi-key', action: () => this.appEventsService.requestModal('change-password') },
  ];

  constructor(
    public authService: AuthService,
    private appEventsService: AppEventsService,
    private router: Router
  ) {}

  openAuthModal(): void {
    this.appEventsService.requestModal('auth');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
