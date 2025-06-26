import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HabitDayComponent } from './habit-day.component';

describe('HabitDayComponent', () => {
  let component: HabitDayComponent;
  let fixture: ComponentFixture<HabitDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitDayComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should display the correct day of the month', () => {
    const testDate = new Date(2025, 5, 26); // 26 de junho de 2025
    component.date = testDate;
    fixture.detectChanges();

    const spanElement: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(spanElement.textContent).toContain('26');
  });


  it('should toggle popover visibility when toggle() is called', () => {
    expect(component.isPopoverOpen).toBeFalse();

    component.toggle();
    expect(component.isPopoverOpen).toBeTrue();

    component.toggle();
    expect(component.isPopoverOpen).toBeFalse();
  });


  it('should update completed when handleCompletedChanged is called', () => {
    component.handleCompletedChanged(5);
    expect(component.completed).toBe(5);
  });


  //TESTE DE CALCULO DA PORCENTAGEM
  it('should calculate the correct completed percentage', () => {
    component.amount = 10;
    component.completed = 4;
    expect(component.completedPercentage).toBe(40);
  });

  it('should return 0 completed percentage when amount is 0', () => {
    component.amount = 0;
    component.completed = 5;
    expect(component.completedPercentage).toBe(0);
  });


  it('should close popover when clicking outside', () => {
    component.isPopoverOpen = true;
    fixture.detectChanges();

    const event = new MouseEvent('click', { bubbles: true });
    document.dispatchEvent(event);

    fixture.detectChanges();
    expect(component.isPopoverOpen).toBeFalse();
  });


  it('should update completed on ngOnChanges when defaultCompleted changes', () => {
    const changes: SimpleChanges = {
      defaultCompleted: {
        currentValue: 3,
        previousValue: 0,
        firstChange: false,
        isFirstChange: () => false,
      }
    };

    component.ngOnChanges(changes);
    expect(component.completed).toBe(3);
  });


  it('should render popover when isPopoverOpen is true', () => {
    component.isPopoverOpen = true;
    fixture.detectChanges();

    const popover = fixture.nativeElement.querySelector('.absolute.z-50');
    expect(popover).toBeTruthy();
  });
});
