import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitDayComponent } from './habit-day.component';

describe('HabitDayComponent', () => {
  let component: HabitDayComponent;
  let fixture: ComponentFixture<HabitDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
