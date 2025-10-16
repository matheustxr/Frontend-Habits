import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './text-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ]
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Input() type: string = 'text';
  private _required = false;
  private _email = false;

  @Input()
  set required(value: boolean | string) {
    this._required = value === '' || value === true;
  }
  get required(): boolean {
    return this._required;
  }

  @Input()
  set email(value: boolean | string) {
    this._email = value === '' || value === true;
  }
  get email(): boolean {
    return this._email;
  }

  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  value: string = '';

  isPasswordVisible = false;

  get inputType(): string {
    if (this.type !== 'password') {
      return this.type;
    }
    return this.isPasswordVisible ? 'text' : 'password';
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() { }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }
}
