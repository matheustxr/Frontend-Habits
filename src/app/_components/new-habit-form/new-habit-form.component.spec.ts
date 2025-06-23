import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHabitFormComponent } from './new-habit-form.component';

describe('NewHabitFormComponent', () => {
  let component: NewHabitFormComponent;
  let fixture: ComponentFixture<NewHabitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHabitFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewHabitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
