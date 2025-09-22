export interface Habit {
  id?: number
  title: string,
  description: string | null,
  weekDays: number[],
  isActive: boolean
}

export interface HabitsResponse {
  habits: Habit[];
}

export interface HabitRequest {
  title: string;
  description: string | null;
  weekDays: number[];
  categoryId?: number;
}
