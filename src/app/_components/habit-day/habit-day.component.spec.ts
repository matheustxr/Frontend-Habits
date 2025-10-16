import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { of } from 'rxjs';

import { HabitDayComponent } from './habit-day.component';
import { HabitService } from '../../services/habit.service';
import { SummaryService } from '../../services/summary.service';

describe('HabitDayComponent', () => {
  let component: HabitDayComponent;
  let fixture: ComponentFixture<HabitDayComponent>;

  let habitServiceSpy: jasmine.SpyObj<HabitService>;
  let summaryServiceSpy: jasmine.SpyObj<SummaryService>;

  beforeEach(async () => {
    const habitSpy = jasmine.createSpyObj('HabitService', ['toggleHabitCompletion', 'getHabitById']);
    const summarySpy = jasmine.createSpyObj('SummaryService', ['getHabitsByDate']);

    await TestBed.configureTestingModule({
      imports: [HabitDayComponent],
      providers: [
        { provide: HabitService, useValue: habitSpy },
        { provide: SummaryService, useValue: summarySpy }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitDayComponent);
    component = fixture.componentInstance;

    habitServiceSpy = TestBed.inject(HabitService) as jasmine.SpyObj<HabitService>;
    summaryServiceSpy = TestBed.inject(SummaryService) as jasmine.SpyObj<SummaryService>;

    summaryServiceSpy.getHabitsByDate.and.returnValue(of([]));

    component.date = new Date();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Popover Visibility', () => {
    it('should show popover in the DOM when isPopoverOpen is true', () => {
      summaryServiceSpy.getHabitsByDate.and.returnValue(of([]));

      component.isPopoverOpen = true;
      fixture.detectChanges();

      const popover = fixture.nativeElement.querySelector('.fixed.z-50');
      expect(popover).toBeTruthy();
    });

    it('should close popover on document click outside the component', () => {
      component.isPopoverOpen = true;
      fixture.detectChanges();

      document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(component.isPopoverOpen).toBeFalse();
    });
  });

  describe('State and Event Handling', () => {
    it('should update "completed" property on ngOnChanges', () => {
      component.defaultCompleted = 3;
      const changes: SimpleChanges = {
        defaultCompleted: {
          currentValue: 3, previousValue: 0, firstChange: false, isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component.completed).toBe(3);
    });

    it('should emit editHabit event and close popover on onEditHabit', () => {
      spyOn(component.editHabit, 'emit');
      spyOn(component, 'close').and.callThrough();
      const mockHabit = { id: 1, title: 'Test' };

      component.onEditHabit(mockHabit);

      expect(component.editHabit.emit).toHaveBeenCalledOnceWith(mockHabit);
      expect(component.close).toHaveBeenCalledTimes(1);
    });
  });
});
