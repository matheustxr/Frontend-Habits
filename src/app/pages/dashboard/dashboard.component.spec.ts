import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { SummaryService } from '../../services/summary.service';
import { HabitSummary } from '../../interfaces/habit-summary';
import dayjs from 'dayjs';
import { AuthService } from '../../services/auth.service';
import { HabitService } from '../../services/habit.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let summaryServiceSpy: jasmine.SpyObj<SummaryService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let habitServiceSpy: jasmine.SpyObj<HabitService>;

  const mockSummary: HabitSummary[] = [
    { id: 1, date: new Date('2025-06-15T12:00:00Z').toISOString(), amount: 3, completed: 2 },
    { id: 2, date: new Date('2025-06-20T12:00:00Z').toISOString(), amount: 1, completed: 1 }
  ];

  beforeEach(async () => {
    const summarySpy = jasmine.createSpyObj('SummaryService', ['getSummary', 'getHabitsByDate']);
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const habitSpy = jasmine.createSpyObj('HabitService', ['getHabitById']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: SummaryService, useValue: summarySpy },
        { provide: AuthService, useValue: authSpy },
        { provide: HabitService, useValue: habitSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    summaryServiceSpy = TestBed.inject(SummaryService) as jasmine.SpyObj<SummaryService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    habitServiceSpy = TestBed.inject(HabitService) as jasmine.SpyObj<HabitService>;
  });

  it('should create', () => {
    summaryServiceSpy.getSummary.and.returnValue(of([]));
    authServiceSpy.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should generate correct number of days for a given month', () => {
    const dates = component['generateDatesFromMonth'](2025, 1);
    expect(dates.length).toBe(28);
    expect(dayjs(dates[0]).date()).toBe(1);
    expect(dayjs(dates[27]).date()).toBe(28);
  });

  it('should call getSummary and populate summary data on updateCalendar', () => {
    summaryServiceSpy.getSummary.and.returnValue(of(mockSummary));

    component.updateCalendar();

    expect(component.dates.length).toBeGreaterThan(0);
    expect(summaryServiceSpy.getSummary).toHaveBeenCalledTimes(1);
    expect(component.summary).toEqual(mockSummary);
  });

  it('should return correct day data from summary for a specific date', () => {
    component.summary = mockSummary;

    const testDate = new Date('2025-06-20T12:00:00Z');
    const result = component.getDayData(testDate);

    expect(result).toEqual(mockSummary[1]);
  });
});
