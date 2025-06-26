import { of, throwError } from 'rxjs';

export class MockHabitService {
  getHabitsByDate() {
    return of({
      possibleHabits: [
        { id: '1', title: 'Drink water' },
        { id: '2', title: 'Meditate' }
      ],
      completedHabits: ['1']
    });
  }

  toggleHabit(habitId: string) {
    return of(null);
  }
}
