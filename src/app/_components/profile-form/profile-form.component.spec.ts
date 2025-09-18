import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProfileFormComponent } from './profile-form.component';
import { UserService } from '../../services/user.service';
import { AppEventsService } from '../../services/app-events.service';
import { AuthService } from '../../services/auth.service';
import { TextInputComponent } from '../text-input/text-input.component';
import { UserProfile } from '../../interfaces/user.model';

describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;

  let userServiceSpy: jasmine.SpyObj<UserService>;
  let appEventsServiceSpy: jasmine.SpyObj<AppEventsService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const userMock = jasmine.createSpyObj('UserService', ['getUserProfile', 'updateUserProfile']);
    const eventsMock = jasmine.createSpyObj('AppEventsService', ['notifyFormSuccess']);
    const authMock = jasmine.createSpyObj('AuthService', ['updateStoredUserName']);

    await TestBed.configureTestingModule({
      imports: [ProfileFormComponent, FormsModule, TextInputComponent],
      providers: [
        { provide: UserService, useValue: userMock },
        { provide: AppEventsService, useValue: eventsMock },
        { provide: AuthService, useValue: authMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    appEventsServiceSpy = TestBed.inject(AppEventsService) as jasmine.SpyObj<AppEventsService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    userServiceSpy.getUserProfile.and.returnValue(of({ name: '', email: '' }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should load user profile successfully', () => {
      const mockProfile: UserProfile = { name: 'Test User', email: 'test@test.com' };
      userServiceSpy.getUserProfile.and.returnValue(of(mockProfile));

      fixture.detectChanges();

      expect(userServiceSpy.getUserProfile).toHaveBeenCalledTimes(1);
      expect(component.userData).toEqual(mockProfile);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle error when loading user profile', () => {
      userServiceSpy.getUserProfile.and.returnValue(throwError(() => new Error('Failed to load')));

      fixture.detectChanges();

      expect(component.errorMessage).toBe('Não foi possível carregar os dados do perfil.');
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('onSubmit', () => {
    it('should update user profile successfully and notify services', () => {
      const updatedProfile: UserProfile = { name: 'Updated User', email: 'updated@test.com' };
      component.userData = updatedProfile;
      userServiceSpy.updateUserProfile.and.returnValue(of(undefined));

      component.onSubmit();

      expect(userServiceSpy.updateUserProfile).toHaveBeenCalledOnceWith(updatedProfile);
      expect(authServiceSpy.updateStoredUserName).toHaveBeenCalledOnceWith(updatedProfile.name);
      expect(appEventsServiceSpy.notifyFormSuccess).toHaveBeenCalledTimes(1);
      expect(component.successMessage).toBe('Perfil atualizado com sucesso!');
      expect(component.isLoading).toBeFalse();
    });

    it('should handle error when updating user profile', () => {
      const errorResponse = { error: { message: 'Update failed.' } };
      userServiceSpy.updateUserProfile.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(component.errorMessage).toBe('Update failed.');
      expect(authServiceSpy.updateStoredUserName).not.toHaveBeenCalled();
      expect(appEventsServiceSpy.notifyFormSuccess).not.toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    });
  });
});
