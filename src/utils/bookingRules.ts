/**
 * Lógica pura desacoplada para validación y gestión de reservas en BAM ON STAGE.
 * Probable de forma determinista mediante node:test.
 */

export interface BookingSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes?: number;
  status: 'Pendiente' | 'Aceptada' | 'Rechazada' | 'Cancelada' | 'Completada';
}

export interface ReviewItem {
  id: string;
  rating: number; // 1 to 5
  comment?: string;
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isDateInPast(dateStr: string): boolean {
  if (!dateStr) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return true;
  const targetDate = new Date(year, month - 1, day);
  return targetDate < today;
}

/**
 * Convierte 'HH:mm' a minutos desde la medianoche
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, mins] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (mins || 0);
}

/**
 * Comprueba si un nuevo horario solapa con reservas existentes confirmadas o pendientes
 */
export function isSlotConflicting(
  existingBookings: BookingSlot[],
  newDate: string,
  newTime: string,
  newDuration = 60
): boolean {
  const newStart = timeToMinutes(newTime);
  const newEnd = newStart + newDuration;

  return existingBookings.some((booking) => {
    // Solo causan conflicto reservas activas (Pendientes o Aceptadas)
    if (booking.status !== 'Pendiente' && booking.status !== 'Aceptada') {
      return false;
    }
    if (booking.date !== newDate) {
      return false;
    }

    const bStart = timeToMinutes(booking.time);
    const bEnd = bStart + (booking.durationMinutes || 60);

    // Hay solapamiento si newStart < bEnd y newEnd > bStart
    return newStart < bEnd && newEnd > bStart;
  });
}

/**
 * Calcula el promedio y total de valoraciones
 */
export function calculateInstructorRating(reviews: ReviewItem[]): {
  average: number;
  count: number;
} {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  const avg = Math.round((sum / reviews.length) * 10) / 10;
  return {
    average: avg,
    count: reviews.length,
  };
}

/**
 * Formato de moneda colombiana COP
 */
export function formatCurrencyCOP(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '$ 0 COP';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}
