import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { SummaryService } from '../../services/summary.service';
import { MockSummaryService, mockSummary } from '../../testing/habit-summary';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';

// ✅ Mock simples do AuthService
class MockAuthService {
  isAuthenticated() {
    return true;
  }
  getUser() {
    return { id: 1, name: 'Usuário Teste' };
  }
  logout() {}
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let summaryService: MockSummaryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: SummaryService, useClass: MockSummaryService },
        { provide: AuthService, useClass: MockAuthService }, // ✅ mockamos o AuthService aqui
      ],
      schemas: [NO_ERRORS_SCHEMA], // evita precisar importar HeaderComponent
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    summaryService = TestBed.inject(SummaryService) as unknown as MockSummaryService;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update calendar and fetch summary', () => {
    spyOn(summaryService, 'getSummary').and.returnValue(of(mockSummary));
    component.updateCalendar();
    expect(summaryService.getSummary).toHaveBeenCalledTimes(1);
    expect(component.summary).toEqual(mockSummary);
  });

  it('should return correct day data from summary', () => {
    component.summary = mockSummary;
    const testDate = new Date(2025, 5, 20);
    const result = component.getDayData(testDate);
    expect(result).toEqual(mockSummary[1]);
  });
});
