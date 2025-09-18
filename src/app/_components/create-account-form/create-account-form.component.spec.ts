import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CreateAccountFormComponent } from './create-account-form.component';
import { AuthService } from '../../services/auth.service';
import { TextInputComponent } from '../text-input/text-input.component';

describe('CreateAccountFormComponent', () => {
  let component: CreateAccountFormComponent;
  let fixture: ComponentFixture<CreateAccountFormComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['createAccount']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreateAccountFormComponent, FormsModule, TextInputComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccountFormComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error if passwords do not match', () => {
    component.credentials.name = 'Test User';
    component.credentials.email = 'test@test.com';
    component.credentials.password = 'Password123!';
    component.confirmPassword = 'DifferentPassword123!';

    component.onSubmit();

    expect(component.errorMessage).toBe('As senhas não correspondem.');
    expect(authServiceSpy.createAccount).not.toHaveBeenCalled();
  });

  it('should display a password strength error if the password is weak', () => {
    component.credentials.name = 'Test User';
    component.credentials.email = 'test@test.com';
    component.credentials.password = 'weak';
    component.confirmPassword = 'weak';

    component.onSubmit();

    expect(component.passwordStrengthError).toBe('A senha não atende aos requisitos de segurança.');
    expect(authServiceSpy.createAccount).not.toHaveBeenCalled();
  });

  it('should call authService.createAccount and navigate on success', () => {
    const strongPassword = 'StrongPassword123!';
    component.credentials = {
      name: 'Test User',
      email: 'test@test.com',
      password: strongPassword
    };
    component.confirmPassword = strongPassword;
    authServiceSpy.createAccount.and.returnValue(of({ name: 'Test User', token: 'fake-token' }));

    component.onSubmit();

    expect(authServiceSpy.createAccount).toHaveBeenCalledOnceWith(component.credentials);
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/dashboard']);
    expect(component.errorMessage).toBeNull();
  });

  it('should display an error message on API failure', () => {
    const strongPassword = 'StrongPassword123!';
    component.credentials = {
      name: 'Test User',
      email: 'test@test.com',
      password: strongPassword
    };
    component.confirmPassword = strongPassword;

    const errorResponse = { error: { message: 'Este email já está em uso.' } };
    authServiceSpy.createAccount.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(component.errorMessage).toBe('Este email já está em uso.');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
