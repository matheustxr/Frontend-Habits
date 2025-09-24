import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HabitService } from '../../services/habit.service';
import { Habit, HabitRequest } from '../../interfaces/habit.model';
import { HabitFormComponent } from './habit-form.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { SimpleChanges } from '@angular/core';

describe('HabitFormComponent', () => {
  let component: HabitFormComponent;
  let fixture: ComponentFixture<HabitFormComponent>;

  let habitServiceSpy: jasmine.SpyObj<HabitService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('HabitService', ['createHabit', 'updateHabit']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HabitFormComponent,
        TextInputComponent,
      ],
      providers: [
        { provide: HabitService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HabitFormComponent);
    component = fixture.componentInstance;

    // Injetamos nosso dublê para que possamos controlá-lo nos teste
    habitServiceSpy = TestBed.inject(HabitService) as jasmine.SpyObj<HabitService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form fields when habitToEdit input is set', () => {
    const habitToEdit: Habit = {
      id: 1,
      title: 'Ler 10 páginas',
      description: 'Ficção científica',
      weekDays: [1, 3, 5],
      isActive: true
    };

    component.habitToEdit = habitToEdit;
    const changes: SimpleChanges = { habitToEdit: { currentValue: habitToEdit, previousValue: null, firstChange: true, isFirstChange: () => true } };
    component.ngOnChanges(changes);
    fixture.detectChanges();

    expect(component.title).toBe('Ler 10 páginas');
    expect(component.description).toBe('Ficção científica');
    expect(component.weekDaysFlags).toEqual([false, true, false, true, false, true, false]);
  });

  it('should call createHabit when submitting a new habit (habitToEdit is null)', () => {
    spyOn(component.habitSaved, 'emit');
    const mockCreatedHabit: Habit = { id: 2, title: 'Beber água', description: null, weekDays: [0,1,2,3,4,5,6], isActive: true };
    habitServiceSpy.createHabit.and.returnValue(of(mockCreatedHabit));

    component.title = 'Beber água';
    component.weekDaysFlags.fill(true);

    component.createNewHabit();

    const expectedRequest: HabitRequest = { title: 'Beber água', description: null, weekDays: [0,1,2,3,4,5,6] };
    expect(habitServiceSpy.createHabit).toHaveBeenCalledOnceWith(expectedRequest);
    expect(habitServiceSpy.updateHabit).not.toHaveBeenCalled();
    expect(component.habitSaved.emit).toHaveBeenCalledTimes(1);
  });

  it('should call updateHabit when submitting an existing habit (habitToEdit is not null)', () => {
    spyOn(component.habitSaved, 'emit');
    const mockUpdatedHabit: Habit = { id: 1, title: 'Correr 5km', description: null, weekDays: [2,4], isActive: true };
    habitServiceSpy.updateHabit.and.returnValue(of(mockUpdatedHabit));

    component.habitToEdit = { id: 1, title: 'Correr', description: null, weekDays: [1,3], isActive: true };
    component.title = 'Correr 5km';
    component.weekDaysFlags = [false, false, true, false, true, false, false]; // Qua, Qui

    component.createNewHabit();

    const expectedRequest: HabitRequest = { title: 'Correr 5km', description: null, weekDays: [2, 4] };
    expect(habitServiceSpy.updateHabit).toHaveBeenCalledOnceWith(1, expectedRequest);
    expect(habitServiceSpy.createHabit).not.toHaveBeenCalled();
    expect(component.habitSaved.emit).toHaveBeenCalledTimes(1);
  });

  it('should not call any service if form is invalid (no title)', () => {
    spyOn(window, 'alert');
    component.title = '';
    component.weekDaysFlags[0] = true;

    component.createNewHabit();

    expect(window.alert).toHaveBeenCalledWith('Preencha todos os campos');
    expect(habitServiceSpy.createHabit).not.toHaveBeenCalled();
    expect(habitServiceSpy.updateHabit).not.toHaveBeenCalled();
  });
});
