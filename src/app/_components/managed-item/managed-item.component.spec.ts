import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedItemComponent } from './managed-item.component';

describe('ManagedItemComponent', () => {
  let component: ManagedItemComponent;
  let fixture: ComponentFixture<ManagedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagedItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
