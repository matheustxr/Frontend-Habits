import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HabitService } from '../../services/habit.service';
import { Habit, HabitRequest } from '../../interfaces/habit.model';
import { HabitFormComponent } from './habit-form.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { SimpleChanges } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HabitFormComponent', () => {
  let component: HabitFormComponent;
  let fixture: ComponentFixture<HabitFormComponent>;

  // Criamos um "dublê" (mock) para o HabitService
  let habitServiceSpy: jasmine.SpyObj<HabitService>;

  beforeEach(async () => {
    // Definimos os métodos do serviço que queremos simular
    const spy = jasmine.createSpyObj('HabitService', ['createHabit', 'updateHabit']);

    await TestBed.configureTestingModule({
      // 1. O componente a ser testado (HabitFormComponent) é importado
      // 2. Suas dependências de template (FormsModule, TextInputComponent) também são importadas
      imports: [
        FormsModule,
        HabitFormComponent,
        TextInputComponent,
      ],
      providers: [
        // 3. O serviço injetado é fornecido com uma versão "mock"
        { provide: HabitService, useValue: spy }
      ],
      // Opcional: Ajuda a ignorar componentes filhos que não queremos testar em detalhe
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HabitFormComponent);
    component = fixture.componentInstance;

    // Injetamos nosso dublê para que possamos controlá-lo nos testes
    habitServiceSpy = TestBed.inject(HabitService) as jasmine.SpyObj<HabitService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form fields when habitToEdit input is set', () => {
    // Arrange
    const habitToEdit: Habit = {
      id: 1,
      title: 'Ler 10 páginas',
      description: 'Ficção científica',
      weekDays: [1, 3, 5],
      isActive: true
    };

    // Act
    component.habitToEdit = habitToEdit;
    const changes: SimpleChanges = { habitToEdit: { currentValue: habitToEdit, previousValue: null, firstChange: true, isFirstChange: () => true } };
    component.ngOnChanges(changes);
    fixture.detectChanges();

    // Assert
    expect(component.title).toBe('Ler 10 páginas');
    expect(component.description).toBe('Ficção científica');
    expect(component.weekDaysFlags).toEqual([false, true, false, true, false, true, false]);
  });

  it('should call createHabit when submitting a new habit', () => {
    // Arrange
    spyOn(component.habitSaved, 'emit');
    const mockCreatedHabit: Habit = { id: 2, title: 'Beber água', description: null, weekDays: [0,1,2,3,4,5,6], isActive: true };
    habitServiceSpy.createHabit.and.returnValue(of(mockCreatedHabit));

    component.title = 'Beber água';
    component.description = null;
    component.isActive = true;
    component.weekDaysFlags.fill(true);

    // Act
    component.createNewHabit();

    // Assert
    const expectedRequest: HabitRequest = { title: 'Beber água', description: null, weekDays: [0,1,2,3,4,5,6], isActive: true };
    expect(habitServiceSpy.createHabit).toHaveBeenCalledOnceWith(expectedRequest);
    expect(habitServiceSpy.updateHabit).not.toHaveBeenCalled();
    expect(component.habitSaved.emit).toHaveBeenCalledTimes(1);
  });

  it('should call updateHabit when submitting an existing habit', () => {
    // Arrange
    spyOn(component.habitSaved, 'emit');
    const mockUpdatedHabit: Habit = { id: 1, title: 'Correr 5km', description: 'No parque', weekDays: [2,4], isActive: true };
    habitServiceSpy.updateHabit.and.returnValue(of(mockUpdatedHabit));

    component.habitToEdit = { id: 1, title: 'Correr', description: null, weekDays: [1,3], isActive: true };
    component.title = 'Correr 5km';
    component.description = 'No parque';
    component.isActive = true;
    component.weekDaysFlags = [false, false, true, false, true, false, false];

    // Act
    component.createNewHabit();

    // Assert
    const expectedRequest: HabitRequest = { title: 'Correr 5km', description: 'No parque', weekDays: [2, 4], isActive: true };
    expect(habitServiceSpy.updateHabit).toHaveBeenCalledOnceWith(1, expectedRequest);
    expect(habitServiceSpy.createHabit).not.toHaveBeenCalled();
    expect(component.habitSaved.emit).toHaveBeenCalledTimes(1);
  });

  it('should not call any service if form is invalid (no title)', () => {
    // Arrange
    spyOn(window, 'alert');
    component.title = ''; // Título inválido
    component.weekDaysFlags[0] = true; // Dia válido

    // Act
    component.createNewHabit();

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Por favor, defina um título e escolha pelo menos um dia da semana.');
    expect(habitServiceSpy.createHabit).not.toHaveBeenCalled();
    expect(habitServiceSpy.updateHabit).not.toHaveBeenCalled();
  });
});
