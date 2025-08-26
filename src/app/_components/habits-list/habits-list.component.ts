// habits-list.component.ts
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService } from '../../services/habit.service';
import { SummaryService } from '../../services/summary.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-habits-list',
  imports: [CommonModule],
  templateUrl: './habits-list.component.html',
})
export class HabitsListComponent implements OnChanges {
  @Input() date!: Date;
  @Output() completedChange = new EventEmitter<number>();

  habits: Array<{ id: string; title: string; completed: boolean }> = [];

  constructor(
    private habitService: HabitService,
    private summaryService: SummaryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] && this.date) {
      this.loadHabitsForDate();
    }
  }

  loadHabitsForDate() {
    this.summaryService.getHabitsByDate().subscribe((response: any) => {
      this.habits = response.possibleHabits.map((habit: any) => ({
        id: habit.id,
        title: habit.title,
        completed: response.completedHabits.includes(habit.id),
      }));
      this.emitCompletedCount();
      this.cdr.detectChanges();
    });
  }

  toggleHabit(habitId: string) {
    const index = this.habits.findIndex(h => h.id === habitId);
    if (index === -1) return;

    const dateISO = dayjs(this.date).toISOString();

    const originalCompletedState = this.habits[index].completed;
      this.habits = this.habits.map((h, i) =>
        i === index ? { ...h, completed: !originalCompletedState } : h
      );

    this.habitService.toggleHabit(habitId, dateISO).subscribe({
      next: () => {
        this.emitCompletedCount();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao atualizar hábito:', err);

        this.habits = this.habits.map((h, i) =>
          i === index ? { ...h, completed: originalCompletedState } : h
        );
        this.emitCompletedCount();
        this.cdr.detectChanges();
      }
    });
  }

  private emitCompletedCount() {
    const completedCount = this.habits.filter(h => h.completed).length;
    this.completedChange.emit(completedCount);
  }
}
