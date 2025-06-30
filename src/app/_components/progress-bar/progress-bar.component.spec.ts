import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBarComponent } from './progress-bar.component';
import { By } from '@angular/platform-browser';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set width of progress bar based on "progress" input', () => {
    component.progress = 65; // define valor de progresso
    fixture.detectChanges(); // atualiza a view

    const progressElement = fixture.debugElement.query(By.css('[role="progressbar"]'));
    const widthStyle = progressElement.nativeElement.style.width;

    expect(widthStyle).toBe('65%'); // esperamos 65% na barra
  });

  it('should reflect progress value in aria-valuenow attribute', () => {
    component.progress = 80;
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('[role="progressbar"]'));
    const ariaValueNow = progressElement.attributes['aria-valuenow'];

    expect(ariaValueNow).toBe('80');
  });
});
