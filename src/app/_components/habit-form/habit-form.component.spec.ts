import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habit, HabitRequest } from '../../interfaces/habit.model';
import { HabitService } from '../../services/habit.service';
import { TextInputComponent } from '../text-input/text-input.component';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TextInputComponent],
  templateUrl: './habit-form.component.html',
})
export class HabitFormComponent implements OnChanges {
  @Input() habitToEdit: Habit | null = null;
  @Output() habitSaved = new EventEmitter<void>();

  title: string = '';
  description: string | null = null;
  weekDaysFlags: boolean[] = Array(7).fill(false);
  isActive: boolean = true;

  isEditing = false;

  constructor(private habitService: HabitService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['habitToEdit'] && this.habitToEdit) {
      this.isEditing = true;
      this.title = this.habitToEdit.title;
      this.description = this.habitToEdit.description;
      this.isActive = this.habitToEdit.isActive;

      this.weekDaysFlags.fill(false);
      this.habitToEdit.weekDays.forEach(dayIndex => {
        this.weekDaysFlags[dayIndex] = true;
      });
    } else {
      this.isEditing = false;
    }
  }

  public createNewHabit(): void {
    const selectedWeekDays = this.getWeekDaysFromFlags();

    if (!this.title || selectedWeekDays.length === 0) {
      alert('Preencha todos os campos');
      return;
    }

    const request: HabitRequest = {
      title: this.title,
      description: this.description,
      weekDays: selectedWeekDays,
      isActive: this.isActive,
    };

    if (this.isEditing) {
      this.habitService.updateHabit(this.habitToEdit!.id!, request).subscribe(() => {
        alert('Hábito atualizado com sucesso!');
        this.resetForm();
        this.habitSaved.emit();
      });
    } else {
      this.habitService.createHabit(request).subscribe(() => {
        alert('Hábito criado com sucesso!');
        this.resetForm();
        this.habitSaved.emit();
      });
    }
  }

  private resetForm(): void {
    this.title = '';
    this.description = null;
    this.weekDaysFlags.fill(false);
    this.isActive = true;
    this.habitToEdit = null;
    this.isEditing = false;
  }

  private getWeekDaysFromFlags(): number[] {
    return this.weekDaysFlags
      .map((isSelected, index) => isSelected ? index : -1)
      .filter(index => index !== -1);
  }
}
