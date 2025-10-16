import { of } from 'rxjs';
import { HabitSummary } from '../interfaces/habit-summary';

export class MockSummaryService {
  getHabitsByDate() {
    return of([
      { id: 1, title: 'Drink water', completed: true },
      { id: 2, title: 'Exercise', completed: false }
    ]);
  }

  getSummary(startDate: string, endDate: string) {
    return of(mockSummary);
  }
}

// ✅ Dados de exemplo compatíveis com o tipo HabitSummary
export const mockSummary: HabitSummary[] = [
  {
    id: 1,
    date: new Date(2025, 5, 15).toISOString(),
    amount: 3,
    completed: 2
  },
  {
    id: 2,
    date: new Date(2025, 5, 20).toISOString(),
    amount: 1,
    completed: 1
  }
];
