import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-new-habit-form',
  imports: [FormsModule, CheckboxModule, ButtonModule],
  templateUrl: './new-habit-form.component.html',
})
export class NewHabitFormComponent {
  title = '';
  weekDays: { [key: number]: boolean } = {};

  availableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  createNewHabit() {
    const selectedDays = Object.keys(this.weekDays)
      .filter((key) => this.weekDays[Number(key)])
      .map((key) => Number(key));

    if (!this.title || selectedDays.length === 0) {
      alert('Preencha todos os campos');
      return;
    }

    this.title = '';
    this.weekDays = {};

    alert('Hábito criado com sucesso!');
  }
}
