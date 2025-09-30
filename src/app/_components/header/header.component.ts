import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { LoginFormComponent } from '../login-form/login-form.component';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { AppEventsService } from '../../services/app-events.service';
import { HabitFormComponent } from '../habit-form/habit-form.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule, DialogModule, ButtonModule,
    LoginFormComponent, CreateAccountFormComponent, HabitFormComponent
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  displayModal = false;
  modalHeader = '';
  showCreateAccountForm = false;
  modalContent: 'auth' | 'habit' | null = null;
  private eventsSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    private appEventsService: AppEventsService
  ) {}

  ngOnInit(): void {
    this.eventsSubscription = this.appEventsService.formSuccess$.subscribe(() => {
      this.displayModal = false;
    });
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
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

  toggleFormView(): void {
    this.showCreateAccountForm = !this.showCreateAccountForm;
    this.modalHeader = this.showCreateAccountForm ? 'Criar Conta' : 'Entrar';
  }

  onItemSaved(): void {
    this.appEventsService.notifyFormSuccess();
  }
}
