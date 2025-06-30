import { HabitSummary } from '../app/interfaces/habit-summary';

export const mockSummary: HabitSummary[] = [
  {
    id: '1',
    date: new Date(2025, 5, 15).toString(),
    amount: 3,
    completed: 2
  },
  {
    id: '2',
    date: new Date(2025, 5, 20).toString(),
    amount: 1,
    completed: 1
  }
];
