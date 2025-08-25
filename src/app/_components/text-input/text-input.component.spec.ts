import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from './text-input.component';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, TextInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the label and placeholder passed as Inputs', () => {
    const expectedLabel = 'Nome do Hábito';
    const expectedPlaceholder = 'Ex.: Ler um livro';

    component.label = expectedLabel;
    component.placeholder = expectedPlaceholder;

    fixture.detectChanges();

    const labelElement: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

    expect(labelElement.textContent).toContain(expectedLabel);
    expect(inputElement.placeholder).toBe(expectedPlaceholder);
  });

  it('should update the input value when writeValue is called', () => {
    const initialValue = 'Valor inicial do teste';

    component.writeValue(initialValue);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.value).toBe(initialValue);
  });

  it('should call onChange with the new value when the input changes', () => {
    const onChangeSpy = jasmine.createSpy('onChange spy');

    component.registerOnChange(onChangeSpy);

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const newValue = 'Texto digitado pelo usuário';

    inputElement.value = newValue;
    inputElement.dispatchEvent(new Event('input'));

    expect(onChangeSpy).toHaveBeenCalledWith(newValue);
  });

  it('should call onTouched when the input is blurred', () => {
    const onTouchedSpy = jasmine.createSpy('onTouched spy');
    component.registerOnTouched(onTouchedSpy);
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

    inputElement.dispatchEvent(new Event('blur'));

    expect(onTouchedSpy).toHaveBeenCalled();
  });
});
