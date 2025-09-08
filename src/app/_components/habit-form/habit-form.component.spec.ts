import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HabitService } from '../../services/habit.service';
import { Habit } from '../../interfaces/habit';
import { HabitFormComponent } from './habit-form.component';
import { TextInputComponent } from '../text-input/text-input.component';


describe('HabitFormComponent', () => {
  let component: HabitFormComponent;
  let fixture: ComponentFixture<HabitFormComponent>;
  let habitService: HabitService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ButtonModule,
        HabitFormComponent,
        TextInputComponent,
      ],
      providers: [
        HabitService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HabitFormComponent);
    component = fixture.componentInstance;
    habitService = TestBed.inject(HabitService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show alert if form fields are empty on create', () => {
    spyOn(window, 'alert');
    component.title = '';
    component.weekDaysFlags = Array(7).fill(false);
    component.createNewHabit();
    expect(window.alert).toHaveBeenCalledWith('Preencha todos os campos');
  });

  it('should create a new habit and reset the form', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(component.habitSaved, 'emit');

    component.title = 'Beber água';
    component.weekDaysFlags[1] = true;
    component.weekDaysFlags[3] = true;

    component.createNewHabit();

    const req = httpMock.expectOne(r => r.url.endsWith('/api/habits'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body.title).toBe('Beber água');
    expect(req.request.body.weekDays).toEqual([1, 3]);

    req.flush({});
    tick();

    expect(window.alert).toHaveBeenCalledWith('Hábito criado com sucesso!');
    expect(component.habitSaved.emit).toHaveBeenCalled();
    expect(component.title).toBe('');
    expect(component.weekDaysFlags).toEqual(Array(7).fill(false));
  }));


  it('should update an existing habit and reset the form', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(component.habitSaved, 'emit');

    const habitToEdit = { id: '123', title: 'Correr', weekDays: [2, 4], isActive: true } as Habit;

    component.habitToEdit = habitToEdit;
    component.ngOnChanges({
      habitToEdit: {
        currentValue: habitToEdit,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      }
    });

    component.title = 'Correr na rua';
    component.weekDaysFlags = Array(7).fill(false);
    component.weekDaysFlags[4] = true;
    component.weekDaysFlags[5] = true;

    component.createNewHabit();

    const req = httpMock.expectOne(r => r.url.endsWith('/api/habits/123'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.title).toBe('Correr na rua');
    expect(req.request.body.weekDays).toEqual([4, 5]);

    req.flush({});
    tick();

    expect(window.alert).toHaveBeenCalledWith('Hábito atualizado com sucesso!');
    expect(component.habitSaved.emit).toHaveBeenCalled();
    expect(component.title).toBe('');
    expect(component.weekDaysFlags).toEqual(Array(7).fill(false));
  }));


  it('should populate the form when a habit is passed for editing', fakeAsync(() => {
    const habitData = { id: '123', title: 'Ler', weekDays: [0, 6], isActive: true } as Habit;

    component.habitToEdit = habitData;
    component.ngOnChanges({
      habitToEdit: {
        currentValue: habitData,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      }
    });

    expect(component.title).toBe('Ler');
    expect(component.weekDaysFlags[0]).toBeTrue();
    expect(component.weekDaysFlags[6]).toBeTrue();
    expect(component.weekDaysFlags[1]).toBeFalse();
  }));

});
