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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] && this.date) {
      this.loadHabitsForDate(this.date);
    }
  }

  loadHabitsForDate(date: Date) {
    this.habitService.getHabitsByDate(dayjs(date).toISOString()).subscribe((response: any) => {
      this.habits = response.possibleHabits.map((habit: any) => ({
        id: habit.id,
        title: habit.title,
        completed: response.completedHabits.includes(habit.id),
      }));
      console.log('Dados de hábitos carregados (loadHabitsForDate):', this.habits);
      this.emitCompletedCount();
      this.cdr.detectChanges(); // Força a detecção de mudanças após o carregamento inicial
    });
  }

  toggleHabit(habitId: string) {
    const index = this.habits.findIndex(h => h.id === habitId);
    if (index === -1) return;

    // Guarda o estado ORIGINAL para reversão em caso de erro da API
    const originalCompletedState = this.habits[index].completed;

    // --- ATUALIZAÇÃO OTIMISTA: Atualiza o estado local IMEDIATAMENTE ---
    // Cria um NOVO array com o hábito específico com o estado INVERTIDO
    // Isso garante que o `filter` verá a mudança
    this.habits = this.habits.map((h, i) =>
      i === index ? { ...h, completed: !originalCompletedState } : h
    );

    // LOG PARA VERIFICAR O ESTADO DA LISTA IMEDIATAMENTE APÓS A ATUALIZAÇÃO OTIMISTA
    console.log('Estado da lista de hábitos APÓS atualização otimista (this.habits):', this.habits);
    console.log('Contagem APÓS atualização otimista (this.habits.filter):', this.habits.filter(h => h.completed).length);

    // Chama a API
    this.habitService.toggleHabit(habitId).subscribe({
      next: () => {
        console.log('sucesso ao atualizar hábito no backend');
        this.emitCompletedCount(); // Emite a contagem com o estado LOCAL que AGORA ESTÁ CORRETO
        this.cdr.detectChanges(); // Força a detecção de mudanças após o sucesso da API
      },
      error: (err) => {
        console.error('Erro ao atualizar hábito:', err);
        // Em caso de ERRO da API, REVERTER o estado local para o ORIGINAL
        this.habits = this.habits.map((h, i) =>
          i === index ? { ...h, completed: originalCompletedState } : h
        );
        console.log('Estado da lista de hábitos APÓS erro da API (revertido):', this.habits);
        this.emitCompletedCount(); // Emite a contagem com o estado revertido
        this.cdr.detectChanges(); // Força a detecção de mudanças após erro (reversão)
      }
    });
  }

  private emitCompletedCount() {
    // debugger; // Mantenha o debugger aqui se quiser verificar novamente
    const completedCount = this.habits.filter(h => h.completed).length;
    console.log('📤 Emitting completed count:', completedCount);
    this.completedChange.emit(completedCount);
  }
}