import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the modal when "Novo Hábito" button is clicked', () => {
    expect(component.displayModal).toBeFalse();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();

    button.nativeElement.click();
    fixture.detectChanges();

    expect(component.displayModal).toBeTrue();

    const dialog = fixture.debugElement.query(By.css('p-dialog'));
    expect(dialog).toBeTruthy();
  });
});
