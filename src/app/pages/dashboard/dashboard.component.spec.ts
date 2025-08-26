import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HabitService } from '../../services/summary.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: AuthService;

  const mockSummary = [
    {
      id: '1',
      date: new Date(2025, 5, 15).toString(),
      amount: 3,
      completed: 2
    },
    {
      id: '2',
      date: new Date(2025, 5, 20).toString(),
      amount: 1,
      completed: 1
    }
  ];

  class MockHabitService {
    getSummary() {
      return {
        subscribe: (callback: (data: typeof mockSummary) => void) => {
          callback(mockSummary);
        }
      };
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: HabitService, useClass: MockHabitService },
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate correct number of days for current mounth', () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const dates = component['generateDatesFromMonth'](currentYear, currentMonth);

    const expectedDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    expect(dates.length).toBe(expectedDays);
    expect(dates[0].getDate()).toBe(1);
    expect(dates[expectedDays - 1].getDate()).toBe(expectedDays);
  });

  it('should update calendar and fetch summary', () => {
    component.updateCalendar();

    expect(component.dates.length).toBeGreaterThan(0);
    expect(component.summary).toEqual(mockSummary);
  });

  it('should return correct day data from summary', () => {
    const testDate = new Date(2025, 5, 20);
    const result = component.getDayData(testDate);

    expect(result).toEqual(mockSummary[1]);
  });
});
