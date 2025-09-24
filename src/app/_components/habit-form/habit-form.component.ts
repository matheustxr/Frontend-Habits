import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextInputComponent } from '../text-input/text-input.component';
import { HabitService } from '../../services/habit.service';
import { Habit } from '../../interfaces/habit.model';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [FormsModule, ButtonModule, TextInputComponent],
  templateUrl: './habit-form.component.html',
})
export class HabitFormComponent implements OnChanges {
  description(description: any) {
    throw new Error('Method not implemented.');
  }
  @Input() habitToEdit: Habit | null = null;
  @Output() habitSaved = new EventEmitter<void>();

  title = '';
  weekDaysFlags: boolean[] = Array(7).fill(false);

  availableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  private dayNameToIndex: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
  };

  constructor(private habitService: HabitService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['habitToEdit']) {
      if (this.habitToEdit) {
        this.title = this.habitToEdit.title ?? '';
        this.weekDaysFlags = this.toFlags(this.habitToEdit.weekDays as any);
      } else {
        this.resetForm();
      }
    }
  }

  toggleDay(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.weekDaysFlags[index] = input.checked;
  }

  private toFlags(days: any[]): boolean[] {
    const flags = Array(7).fill(false) as boolean[];
    if (!Array.isArray(days)) return flags;

    for (const d of days) {
      let idx = -1;
      if (typeof d === 'number') idx = d;
      else if (typeof d === 'string') idx = this.dayNameToIndex[d.toLowerCase()] ?? -1;

      if (idx >= 0 && idx <= 6) flags[idx] = true;
    }
    return flags;
  }

  private flagsToIndices(): number[] {
    const result: number[] = [];
    for (let i = 0; i < 7; i++) if (this.weekDaysFlags[i]) result.push(i);
    return result;
  }

  createNewHabit() {
    const selectedDays = this.flagsToIndices();

    if (!this.title.trim() || selectedDays.length === 0) {
      alert('Preencha todos os campos');
      return;
    }

    const requestData: Habit = {
      title: this.title.trim(),
      description: null,
      weekDays: selectedDays,
      isActive: true,
    } as Habit;

    if (this.habitToEdit?.id) {
      this.habitService.updateHabit(this.habitToEdit.id, requestData).subscribe({
        next: () => {
          alert('Hábito atualizado com sucesso!');
          this.habitSaved.emit();
          this.resetForm();
        },
        error: (err) => {
          console.error('Falha ao atualizar hábito:', err);
          alert('Falha ao atualizar hábito. Tente novamente.');
        },
      });
    } else {
      this.habitService.createHabit(requestData).subscribe({
        next: () => {
          alert('Hábito criado com sucesso!');
          this.habitSaved.emit();
          this.resetForm();
        },
        error: (err) => {
          console.error('Falha ao criar hábito:', err);
          alert('Falha ao criar hábito. Tente novamente.');
        },
      });
    }
  }

  resetForm() {
    this.title = '';
    this.weekDaysFlags = Array(7).fill(false);
    this.habitToEdit = null;
  }
}
