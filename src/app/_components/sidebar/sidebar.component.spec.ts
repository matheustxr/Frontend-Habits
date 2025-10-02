import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../services/auth.service';
import { AppEventsService } from '../../services/app-events.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let appEventsServiceSpy: jasmine.SpyObj<AppEventsService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);
    const eventsSpy = jasmine.createSpyObj('AppEventsService', ['requestModal']);

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authSpy },
        { provide: AppEventsService, useValue: eventsSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    appEventsServiceSpy = TestBed.inject(AppEventsService) as jasmine.SpyObj<AppEventsService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user is logged out', () => {
    beforeEach(() => {
      authServiceSpy.isLoggedIn.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should render only the Dashboard link', () => {
      const navLinks = fixture.debugElement.queryAll(By.css('nav a'));
      expect(navLinks.length).toBe(1);
      expect(navLinks[0].nativeElement.textContent).toContain('Dashboard');
    });

    it('should NOT render account settings, logout button, or login button', () => {
      const accountTitle = fixture.debugElement.query(By.css('p.uppercase'));
      const logoutButton = fixture.debugElement.query(By.css('[data-testid="logout-button"]'));
      const loginButton = fixture.debugElement.query(By.css('[data-testid="login-button"]'));

      expect(accountTitle).toBeNull();
      expect(logoutButton).toBeNull();
      expect(loginButton).toBeNull();
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      authServiceSpy.isLoggedIn.and.returnValue(true);
      fixture.detectChanges();
    });

    it('should render all main navigation links', () => {
      const navLinks = fixture.debugElement.queryAll(By.css('nav a'));
      expect(navLinks.length).toBe(component.mainNavLinks.length);
    });

    it('should render the account settings section and logout button', () => {
      const accountTitle = fixture.debugElement.query(By.css('p.uppercase'));
      const settingsButtons = fixture.debugElement.queryAll(By.css('nav button'));
      const logoutButton = fixture.debugElement.query(By.css('[data-testid="logout-button"]'));

      expect(accountTitle.nativeElement.textContent).toBe('Conta');
      expect(settingsButtons.length).toBe(component.settingsActions.length);
      expect(logoutButton).not.toBeNull();
    });

    it('should call requestModal with "profile" when "Meu Perfil" is clicked', () => {
      const profileButton = fixture.debugElement.query(By.css('[data-testid="Meu Perfil"]'));
      profileButton.triggerEventHandler('click', null);

      expect(appEventsServiceSpy.requestModal).toHaveBeenCalledOnceWith('profile');
    });

    it('should call logout method when "Sair" button is clicked', () => {
      spyOn(router, 'navigate');

      const logoutButton = fixture.debugElement.query(By.css('[data-testid="logout-button"]'));
      logoutButton.triggerEventHandler('click', null);

      expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledOnceWith(['/']);
    });
  });
});
