import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HabitService } from '../../services/habit.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

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
      providers: [{ provide: HabitService, useClass: MockHabitService }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate correct number of days for current mounth', () => {
    const currentYear = new Date().getFullYear();
    const currentMounth = new Date().getFullYear();
    const dates = component['generateDatesFromMonth'](currentYear, currentMounth);
    expect(dates.length).toBe(30);
    expect(dates[0].getDate()).toBe(1);
    expect(dates[29].getDate()).toBe(30);
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
