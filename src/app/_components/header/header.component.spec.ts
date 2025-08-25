import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing'; // Importe esta função
import { provideHttpClient } from '@angular/common/http'; // Importe esta função

import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        NoopAnimationsModule
      ],

      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the modal when "Novo Hábito" button is clicked', () => {
    expect(component.displayModal).toBeFalse();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();

    button.nativeElement.click();
    fixture.detectChanges();

    expect(component.displayModal).toBeTrue();

    const dialog = fixture.debugElement.query(By.css('p-dialog'));
    expect(dialog).toBeTruthy();
  });
});
