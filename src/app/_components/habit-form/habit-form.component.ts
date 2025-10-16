import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitService } from '../../services/habit.service';
import { Habit, HabitRequest } from '../../interfaces/habit.model';
import { TextInputComponent } from '../text-input/text-input.component';

@Component({
  selector: 'app-habit-form',
  imports: [CommonModule, FormsModule, TextInputComponent],
  templateUrl: './habit-form.component.html',
})
export class HabitFormComponent implements OnChanges {
  @Input() habitToEdit: Habit | null = null;
  @Output() habitSaved = new EventEmitter<void>();

  title = '';
  description: string | null = null;
  weekDaysFlags: boolean[] = Array(7).fill(false);
  isActive = true;
  isEditing = false;

  readonly availableWeekDays = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado',
  ];

  private readonly dayNameToIndex: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
  };

  constructor(private habitService: HabitService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['habitToEdit'] && this.habitToEdit) {
      this.isEditing = true;
      this.title = this.habitToEdit.title;
      this.description = this.habitToEdit.description;
      this.isActive = this.habitToEdit.isActive;

      this.weekDaysFlags = this.toFlags(this.habitToEdit.weekDays);

    } else if (changes['habitToEdit'] && !this.habitToEdit) {
      this.resetForm();
    }
  }

  toggleDay(index: number): void {
    this.weekDaysFlags[index] = !this.weekDaysFlags[index];
  }

  private toFlags(days: (string | number)[]): boolean[] {
    const flags = Array(7).fill(false);
    if (!Array.isArray(days)) return flags;

    for (const day of days) {
      let idx = -1;
      if (typeof day === 'number') {
        idx = day;
      } else if (typeof day === 'string') {
        idx = this.dayNameToIndex[day.toLowerCase()];
      }

      if (idx >= 0 && idx < 7) {
        flags[idx] = true;
      }
    }
    return flags;
  }

  private getWeekDaysFromFlags(): number[] {
    return this.weekDaysFlags
      .map((isSelected, index) => isSelected ? index : -1)
      .filter(index => index !== -1);
  }

  createNewHabit(): void {
    const selectedDays = this.getWeekDaysFromFlags();
    if (!this.title.trim() || selectedDays.length === 0) {
      alert('Por favor, defina um título e escolha pelo menos um dia da semana.');
      return;
    }

    const requestData: HabitRequest = {
      title: this.title.trim(),
      description: this.description,
      weekDays: selectedDays,
      isActive: this.isActive,
    };

    const operation$ = this.isEditing
      ? this.habitService.updateHabit(this.habitToEdit!.id!, requestData)
      : this.habitService.createHabit(requestData);

    const successMessage = this.isEditing ? 'Hábito atualizado com sucesso!' : 'Hábito criado com sucesso!';
    const errorMessage = this.isEditing ? 'Falha ao atualizar hábito.' : 'Falha ao criar hábito.';

    operation$.subscribe({
      next: () => {
        alert(successMessage);
        this.habitSaved.emit();
        this.resetForm();
      },
      error: (err) => {
        console.error(errorMessage, err);
        alert(`${errorMessage} Tente novamente.`);
      },
    });
  }

  private resetForm(): void {
    this.title = '';
    this.description = null;
    this.weekDaysFlags.fill(false);
    this.isActive = true;
    this.habitToEdit = null;
    this.isEditing = false;
  }
}
