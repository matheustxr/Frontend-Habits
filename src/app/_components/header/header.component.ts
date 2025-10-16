
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { LoginFormComponent } from '../login-form/login-form.component';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';
import { AuthService } from '../../services/auth.service';
import { Subscription, filter } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { AppEventsService, ModalType } from '../../services/app-events.service';
import { HabitFormComponent } from '../habit-form/habit-form.component';
import { ProfileFormComponent } from '../profile-form/profile-form.component';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule, DialogModule, ButtonModule,
    LoginFormComponent, CreateAccountFormComponent, HabitFormComponent,
    ProfileFormComponent, ChangePasswordFormComponent
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() pageTitle: string = 'Dashboard';

  actionButtonText: string = 'Novo Hábito';
  actionButtonIcon: string = 'pi pi-plus';

  displayModal = false;
  modalHeader = '';
  showCreateAccountForm = false;
  modalContent: ModalType | 'category' | null = null;
  private eventsSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    private appEventsService: AppEventsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const formSuccessSub = this.appEventsService.formSuccess$.subscribe(() => {
      this.displayModal = false;
    });

    const routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateButtonState(this.router.url);
    });

    const modalRequestSub = this.appEventsService.modalRequest$.subscribe((modalType: ModalType) => {
      switch (modalType) {
        case 'auth': this.showAuthModal(); break;
        case 'profile': this.showProfileModal(); break;
        case 'change-password': this.showChangePasswordModal(); break;
        case 'habit': this.showNewHabitModal(); break;
      }
    });

    this.eventsSubscription = new Subscription();
    this.eventsSubscription.add(formSuccessSub);
    this.eventsSubscription.add(routerSub);
    this.eventsSubscription.add(modalRequestSub);

    // Garante que o estado do botão esteja correto no carregamento inicial
    this.updateButtonState(this.router.url);
  }

  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  private updateButtonState(url: string): void {
    if (url.includes('/manage/categories')) {
      this.actionButtonText = 'Nova Categoria';
      this.actionButtonIcon = 'pi pi-tag';
    } else {
      this.actionButtonText = 'Novo Hábito';
      this.actionButtonIcon = 'pi pi-plus';
    }
  }

  onMainActionClick(): void {
    if (this.router.url.includes('/manage/categories')) {
      this.showNewCategoryModal();
    } else {
      this.showNewHabitModal();
    }
  }

  showAuthModal(): void {
    this.modalContent = 'auth';
    this.modalHeader = 'Entrar';
    this.showCreateAccountForm = false;
    this.displayModal = true;
  }

  showNewHabitModal(): void {
    this.modalContent = 'habit';
    this.modalHeader = 'Criar Hábito';
    this.displayModal = true;
  }

  showNewCategoryModal(): void {
    this.modalContent = 'category';
    this.modalHeader = 'Criar Categoria';
    this.displayModal = true;
  }

  showProfileModal(): void {
    this.modalContent = 'profile';
    this.modalHeader = 'Meu Perfil';
    this.displayModal = true;
  }

  showChangePasswordModal(): void {
    this.modalContent = 'change-password';
    this.modalHeader = 'Alterar Senha';
    this.displayModal = true;
  }

  toggleFormView(): void {
    this.showCreateAccountForm = !this.showCreateAccountForm;
    this.modalHeader = this.showCreateAccountForm ? 'Criar Conta' : 'Entrar';
  }

  onItemSaved(): void {
    this.appEventsService.notifyFormSuccess();
  }
}
