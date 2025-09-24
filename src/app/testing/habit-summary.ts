import { of, throwError } from 'rxjs';
import { HabitSummary } from '../interfaces/habit-summary';

export class MockSummaryService {
  getHabitsByDate() {
    return of([
      { id: 1, title: 'Drink water', completed: true },
      { id: 2, title: 'Exercise', completed: false }
    ]);
  }
}

export const mockSummary: HabitSummary[] = [
  {
    id: 1,
    date: new Date(2025, 5, 15).toString(),
    amount: 3,
    completed: 2
  },
  {
    id: 2,
    date: new Date(2025, 5, 20).toString(),
    amount: 1,
    completed: 1
  }
];
