import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NewHabitFormComponent } from './new-habit-form.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

describe('NewHabitFormComponent', () => {
  let component: NewHabitFormComponent;
  let fixture: ComponentFixture<NewHabitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CheckboxModule, ButtonModule, NewHabitFormComponent], // assuming NewHabitFormComponent is standalone
    }).compileComponents();

    fixture = TestBed.createComponent(NewHabitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show alert if fields are empty', () => {
    spyOn(window, 'alert');
    component.title = '';
    component.weekDays = {};
    component.createNewHabit();
    expect(window.alert).toHaveBeenCalledWith('Preencha todos os campos');
  });

  it('should reset form and show success alert when data is valid', () => {
    spyOn(window, 'alert');

    component.title = 'Beber água';
    component.weekDays = { 1: true, 3: true };

    component.createNewHabit();
    // });

    expect(component.title).toBe('');
    expect(component.weekDays).toEqual({});
    expect(window.alert).toHaveBeenCalledWith('Hábito criado com sucesso!');
  });
});
