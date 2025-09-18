import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ChangePasswordFormComponent } from './change-password-form.component';
import { UserService } from '../../services/user.service';
import { AppEventsService } from '../../services/app-events.service';
import { TextInputComponent } from '../text-input/text-input.component';
import { HttpErrorResponse } from '@angular/common/http';

describe('ChangePasswordFormComponent', () => {
  let component: ChangePasswordFormComponent;
  let fixture: ComponentFixture<ChangePasswordFormComponent>;

  let userServiceSpy: jasmine.SpyObj<UserService>;
  let appEventsServiceSpy: jasmine.SpyObj<AppEventsService>;

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['changePassword']);
    const appEventsServiceMock = jasmine.createSpyObj('AppEventsService', ['notifyFormSuccess']);

    await TestBed.configureTestingModule({
      imports: [ChangePasswordFormComponent, TextInputComponent, FormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AppEventsService, useValue: appEventsServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordFormComponent);
    component = fixture.componentInstance;

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    appEventsServiceSpy = TestBed.inject(AppEventsService) as jasmine.SpyObj<AppEventsService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error if new password and confirmation do not match', () => {
    component.passwords.current = 'oldPassword123';
    component.passwords.new = 'NewPassword123!';
    component.passwords.confirm = 'DifferentPassword123!';

    component.onSubmit();

    expect(component.errorMessage).toBe('A nova senha e a confirmação não correspondem.');
    expect(userServiceSpy.changePassword).not.toHaveBeenCalled();
  });

  it('should display an error if the new password is not strong enough', () => {
    component.passwords.current = 'oldPassword123';
    component.passwords.new = 'weak';
    component.passwords.confirm = 'weak';

    component.onSubmit();

    expect(component.errorMessage).toBe('A nova senha não atende aos requisitos de segurança.');
    expect(userServiceSpy.changePassword).not.toHaveBeenCalled();
  });

  it('should call userService.changePassword and notify on success', fakeAsync(() => {
    const newPassword = 'ValidNewPassword123!';
    component.passwords.current = 'oldPassword123';
    component.passwords.new = newPassword;
    component.passwords.confirm = newPassword;

    userServiceSpy.changePassword.and.returnValue(of(undefined));

    component.onSubmit();

    const expectedRequest = { password: 'oldPassword123', newPassword: newPassword };
    expect(userServiceSpy.changePassword).toHaveBeenCalledOnceWith(expectedRequest);
    expect(component.successMessage).toBe('Senha alterada com sucesso!');
    expect(component.isLoading).toBeFalse();
    expect(appEventsServiceSpy.notifyFormSuccess).not.toHaveBeenCalled();

    tick(1500);

    expect(appEventsServiceSpy.notifyFormSuccess).toHaveBeenCalledTimes(1);
  }));

  it('should display an error message on API failure', () => {
    const newPassword = 'ValidNewPassword123!';
    component.passwords.current = 'oldPassword123';
    component.passwords.new = newPassword;
    component.passwords.confirm = newPassword;

    const errorResponse = { error: { message: 'Senha atual incorreta.' } };
    userServiceSpy.changePassword.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(component.errorMessage).toBe('Senha atual incorreta.');
    expect(component.successMessage).toBeNull();
    expect(component.isLoading).toBeFalse();
    expect(appEventsServiceSpy.notifyFormSuccess).not.toHaveBeenCalled();
  });
});
