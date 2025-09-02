export interface Habit {
  id?: string
  title: string,
  description: string | null,
  weekDays: number[],
  isActive: boolean
}
