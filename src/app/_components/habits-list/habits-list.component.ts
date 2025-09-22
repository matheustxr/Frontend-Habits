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
import { SummaryService } from '../../services/summary.service';
import dayjs from 'dayjs';
import { HabitService } from '../../services/habit.service';

@Component({
  selector: 'app-habits-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habits-list.component.html',
})
export class HabitsListComponent implements OnChanges {
  @Input() date!: Date;
  @Output() completedChange = new EventEmitter<number>();
  @Output() editHabit = new EventEmitter<any>();

  habits: Array<{ id: number; title: string; completed: boolean }> = [];

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
    const formattedDate = dayjs(this.date).format('YYYY-MM-DD');

    this.summaryService.getHabitsByDate(formattedDate).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response)) {
          this.habits = response.map((habit: any) => ({
            id: habit.id,
            title: habit.title,
            completed: habit.completed,
          }));
          this.emitCompletedCount();
        } else {
          this.habits = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar hábitos do dia:', err);
        this.habits = [];
        this.cdr.detectChanges();
      }
    });
  }

  onEdit(habitId: number) {
    this.habitService.getHabitById(habitId).subscribe(
      (habit) => this.editHabit.emit(habit),
      (error) => console.error('Erro ao buscar hábito para edição:', error)
    );
  }

  toggleHabit(habitId: number) {
    const index = this.habits.findIndex(h => h.id === habitId);
    if (index === -1) return;

    const formattedDate = dayjs(this.date).format('YYYY-MM-DD');

    const originalCompletedState = this.habits[index].completed;
      this.habits = this.habits.map((h, i) =>
        i === index ? { ...h, completed: !originalCompletedState } : h
      );

    this.habitService.toggleHabitCompletion(habitId, formattedDate).subscribe({
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
