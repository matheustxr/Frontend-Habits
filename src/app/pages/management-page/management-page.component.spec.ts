import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ManagementPageComponent } from './management-page.component';
import { CategoriesService } from '../../services/categories.service';
import { Habit } from '../../interfaces/habit.model';
import { Category } from '../../interfaces/category.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HabitService } from '../../services/habit.service';

describe('ManagementPageComponent', () => {
  let component: ManagementPageComponent;
  let fixture: ComponentFixture<ManagementPageComponent>;

  let habitsServiceSpy: jasmine.SpyObj<HabitService>;
  let categoriesServiceSpy: jasmine.SpyObj<CategoriesService>;

  let activatedRouteMock: any;

  beforeEach(async () => {
    const habitsSpy = jasmine.createSpyObj('HabitsService', ['getAllHabits', 'getHabitById', 'deleteHabit']);
    const categoriesSpy = jasmine.createSpyObj('CategoriesService', ['getAllCategories', 'getCategoryById', 'deleteCategory']);

    activatedRouteMock = {
      paramMap: of(convertToParamMap({ type: 'habits' }))
    };

    await TestBed.configureTestingModule({
      imports: [ManagementPageComponent],
      providers: [
        { provide: HabitService, useValue: habitsSpy },
        { provide: CategoriesService, useValue: categoriesSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementPageComponent);
    component = fixture.componentInstance;

    habitsServiceSpy = TestBed.inject(HabitService) as jasmine.SpyObj<HabitService>;
    categoriesServiceSpy = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;
  });

  it('should create', () => {
    habitsServiceSpy.getAllHabits.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when route type is "habits"', () => {
    beforeEach(() => {
      activatedRouteMock.paramMap = of(convertToParamMap({ type: 'habits' }));

      const mockHabits: Habit[] = [{ id: 1, title: 'Test Habit', description: null, weekDays: [], isActive: true }];
      habitsServiceSpy.getAllHabits.and.returnValue(of(mockHabits));
    });

    it('should set title to "Meus Hábitos" and load habits data', () => {
      fixture.detectChanges();

      expect(component.title).toBe('Meus Hábitos');
      expect(habitsServiceSpy.getAllHabits).toHaveBeenCalledTimes(1);
      expect(categoriesServiceSpy.getAllCategories).not.toHaveBeenCalled();
      expect(component.items.length).toBe(1);
      expect(component.items[0].name).toBe('Test Habit');
    });

    it('should call habitsService.deleteHabit on handleDeleteItem', () => {
      fixture.detectChanges();
      spyOn(window, 'confirm').and.returnValue(true);
      habitsServiceSpy.deleteHabit.and.returnValue(of(undefined));

      component.handleDeleteItem({ id: 1, name: 'Test Habit' });

      expect(habitsServiceSpy.deleteHabit).toHaveBeenCalledOnceWith(1);
      expect(categoriesServiceSpy.deleteCategory).not.toHaveBeenCalled();
    });
  });

  describe('when route type is "categories"', () => {
    beforeEach(() => {
      activatedRouteMock.paramMap = of(convertToParamMap({ type: 'categories' }));

      const mockCategories: Category[] = [{ id: 1, category: 'Test Category', hexColor: '#FFFFFF' }];
      categoriesServiceSpy.getAllCategories.and.returnValue(of(mockCategories));
    });

    it('should set title to "Minhas Categorias" and load categories data', () => {
      fixture.detectChanges();

      expect(component.title).toBe('Minhas Categorias');
      expect(categoriesServiceSpy.getAllCategories).toHaveBeenCalledTimes(1);
      expect(habitsServiceSpy.getAllHabits).not.toHaveBeenCalled();
      expect(component.items.length).toBe(1);
      console.log(component.items[0].name);
      expect(component.items[0].name).toBe('Test Category');
    });

    it('should call categoriesService.getCategoryById on handleEditItem', () => {
      fixture.detectChanges();
      const mockCategory: Category = { id: 1, category: 'Test Category', hexColor: '#FFFFFF' };
      categoriesServiceSpy.getCategoryById.and.returnValue(of(mockCategory));

      component.handleEditItem({ id: 1, name: 'Test Category' });

      expect(categoriesServiceSpy.getCategoryById).toHaveBeenCalledOnceWith(1);
      expect(habitsServiceSpy.getHabitById).not.toHaveBeenCalled();
      expect(component.displayModal).toBeTrue();
      expect(component.itemToEdit).toEqual(mockCategory);
    });
  });
});
