import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HabitsListComponent } from './habits-list.component';
import { HabitService } from '../../services/habit.service';
import { SummaryService } from '../../services/summary.service';
import { Habit } from '../../interfaces/habit.model';
import { SimpleChanges } from '@angular/core';
import dayjs from 'dayjs';
import { HabitDayResponse } from '../../interfaces/habit-day-response';

describe('HabitsListComponent', () => {
  let component: HabitsListComponent;
  let fixture: ComponentFixture<HabitsListComponent>;

  let summaryServiceSpy: jasmine.SpyObj<SummaryService>;
  let habitServiceSpy: jasmine.SpyObj<HabitService>;

  beforeEach(async () => {
    const summarySpy = jasmine.createSpyObj('SummaryService', ['getHabitsByDate']);
    const habitSpy = jasmine.createSpyObj('HabitService', ['toggleHabitCompletion', 'getHabitById']);

    await TestBed.configureTestingModule({
      imports: [HabitsListComponent],
      providers: [
        { provide: SummaryService, useValue: summarySpy },
        { provide: HabitService, useValue: habitSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HabitsListComponent);
    component = fixture.componentInstance;

    summaryServiceSpy = TestBed.inject(SummaryService) as jasmine.SpyObj<SummaryService>;
    habitServiceSpy = TestBed.inject(HabitService) as jasmine.SpyObj<HabitService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load habits from SummaryService when date changes', () => {
    const mockHabitsResponse: HabitDayResponse[] = [
      { id: 1, title: 'Beber Água', completed: true, categoryId: 1, categoryName: 'Saúde' },
      { id: 2, title: 'Ler Livro', completed: false, categoryId: 2, categoryName: 'Educação' }
    ];
    summaryServiceSpy.getHabitsByDate.and.returnValue(of(mockHabitsResponse));

    const date = new Date();
    component.date = date;
    const changes: SimpleChanges = { date: { currentValue: date, previousValue: null, firstChange: true, isFirstChange: () => true } };
    component.ngOnChanges(changes);
    fixture.detectChanges();

    const expectedDateString = dayjs(date).format('YYYY-MM-DD');
    expect(summaryServiceSpy.getHabitsByDate).toHaveBeenCalledOnceWith(expectedDateString);
    expect(component.habits.length).toBe(2);
    expect(component.habits[0].title).toBe('Beber Água');
    expect(component.habits[0].completed).toBeTrue();
  });

  it('should optimistically toggle a habit, call HabitService, and emit the new count', () => {
    const initialHabits: HabitDayResponse[] = [ { id: 2, title: 'Hábito 2', completed: false, categoryId: 1, categoryName: 'Cat1' } ];
    component.habits = initialHabits;
    component.date = new Date();
    spyOn(component.completedChange, 'emit');
    habitServiceSpy.toggleHabitCompletion.and.returnValue(of(undefined));

    const habitToToggle = component.habits[0];
    component.toggleHabit(habitToToggle.id);

    expect(component.habits[0].completed).toBeTrue();
    const expectedDateString = dayjs(component.date).format('YYYY-MM-DD');
    expect(habitServiceSpy.toggleHabitCompletion).toHaveBeenCalledOnceWith(habitToToggle.id, expectedDateString);
    expect(component.completedChange.emit).toHaveBeenCalledOnceWith(1);
  });

  it('should revert the toggle and emit the original count on API error', () => {
    const initialHabits: HabitDayResponse[] = [
      { id: 1, title: 'Hábito 1', completed: true, categoryId: 1, categoryName: 'Cat1' },
      { id: 2, title: 'Hábito 2', completed: false, categoryId: 1, categoryName: 'Cat1' }
    ];
    component.habits = initialHabits;
    const initialCompletedCount = 1;

    spyOn(component.completedChange, 'emit');
    habitServiceSpy.toggleHabitCompletion.and.returnValue(throwError(() => new Error('API Error')));

    const habitToToggle = component.habits[1];
    component.toggleHabit(habitToToggle.id);

    expect(component.habits[1].completed).toBeFalse();

    expect(component.completedChange.emit).toHaveBeenCalledOnceWith(initialCompletedCount);
  });

  it('should call getHabitById and emit the result on onEdit', () => {
    const mockHabitDetails: Habit = { id: 1, title: 'Detalhes do Hábito', description: 'desc', weekDays: [1], isActive: true };
    habitServiceSpy.getHabitById.and.returnValue(of(mockHabitDetails));
    spyOn(component.editHabit, 'emit');

    component.onEdit(1);

    expect(habitServiceSpy.getHabitById).toHaveBeenCalledOnceWith(1);
    expect(component.editHabit.emit).toHaveBeenCalledOnceWith(mockHabitDetails);
  });
});
