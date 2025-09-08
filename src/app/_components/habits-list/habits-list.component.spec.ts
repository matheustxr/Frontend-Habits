import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryService } from '../../services/summary.service';
import { MockHabitService } from '../../testing/habit-service.mock';
import { HabitsListComponent } from './habits-list.component';
import { ChangeDetectorRef } from '@angular/core';
import { throwError } from 'rxjs';
import { HabitService } from '../../services/habit.service';
import { MockSummaryService } from '../../testing/habit-summary';

describe('HabitsListComponent', () => {
  let component: HabitsListComponent;
  let fixture: ComponentFixture<HabitsListComponent>;
  let mockService: MockHabitService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitsListComponent],
      providers: [
        { provide: SummaryService, useClass: MockSummaryService },
        { provide: HabitService, useClass: MockHabitService },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HabitsListComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(SummaryService) as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load habits correctly from service on date change', async () => {
    const date = new Date();
    component.date = date;
    component.ngOnChanges({
      date: {
        currentValue: date,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      }
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.habits.length).toBe(2);
    expect(component.habits[0].title).toBe('Drink water');
    expect(component.habits[0].completed).toBeTrue();
    expect(component.habits[1].completed).toBeFalse();
  });

  it('should toggle habit and emit new completed count', async () => {
    const date = new Date();
    component.date = date;
    const emitSpy = spyOn(component.completedChange, 'emit');

    component.ngOnChanges({
      date: {
        currentValue: date,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      }
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const habit = component.habits[1];
    component.toggleHabit(habit.id);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.habits[1].completed).toBeTrue();
    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('should revert toggle on API error', async () => {
    const habitService = TestBed.inject(HabitService) as any;
    spyOn(habitService, 'toggleHabit').and.returnValue(throwError(() => new Error('Erro simulado')));
    const emitSpy = spyOn(component.completedChange, 'emit');

    const date = new Date();
    component.date = date;

    component.ngOnChanges({
      date: {
        currentValue: date,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      }
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const habit = component.habits[1];
    expect(habit.completed).toBeFalse();

    component.toggleHabit(habit.id);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.habits[1].completed).toBeFalse();
    expect(emitSpy).toHaveBeenCalledTimes(2);
  });

});
