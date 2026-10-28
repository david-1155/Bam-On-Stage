/**
 * Utilidades puras para el cálculo y ordenamiento de tareas y compromisos académicos
 */

export interface TaskItem {
  id: string;
  title: string;
  dueDate?: string;
  priority: 'baja' | 'media' | 'alta';
  completed: boolean;
}

export function calculateProgressPercent(total: number, completed: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

export function getDaysRemainingFromDate(dueDateStr: string, referenceDate: Date = new Date()): number | null {
  if (!dueDateStr) return null;
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);

  const due = new Date(dueDateStr + 'T00:00:00');
  if (isNaN(due.getTime())) return null;

  const diffTime = due.getTime() - ref.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isTaskUrgent(task: TaskItem, referenceDate: Date = new Date()): boolean {
  if (task.completed) return false;
  if (task.priority === 'alta') return true;
  if (task.dueDate) {
    const remaining = getDaysRemainingFromDate(task.dueDate, referenceDate);
    return remaining !== null && remaining <= 2;
  }
  return false;
}
