import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🔥 IMPORTANTE

@Component({
  selector: 'app-habits-list',
  imports: [CommonModule, CheckboxModule, FormsModule],
  templateUrl: './habits-list.component.html',
})
export class HabitsListComponent {
  @Input() date!: Date;
  @Output() completedChange = new EventEmitter<number>();

  habits = [
    { id: 1, title: 'Exercício', completed: false },
    { id: 2, title: 'Beber água', completed: false },
    { id: 3, title: 'Dormir bem', completed: false },
  ];

  toggleHabit(habitId: number) {
    const habit = this.habits.find((h) => h.id === habitId);
    if (habit) {
      habit.completed = !habit.completed;
    }

    const completedCount = this.habits.filter((h) => h.completed).length;
    this.completedChange.emit(completedCount);
  }
}
