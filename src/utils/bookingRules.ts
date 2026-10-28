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

export interface AvailableDateOption {
  dateStr: string; // "YYYY-MM-DD"
  dayName: string; // "Lunes"
  dayIndex: number; // 0..6
  formattedShort: string; // "Lun, 2 Nov"
  formattedLong: string; // "Lunes, 2 de Noviembre"
  times: string[]; // ["15:30", "16:30", "17:30"]
}

export interface InstructorScheduleDay {
  day: string;
  dayIndex?: number;
  times: string[];
}

const SPANISH_DAY_INDEX_MAP: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  miércoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  sábado: 6
};

const SPANISH_DAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

const SPANISH_MONTH_NAMES_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

const SPANISH_MONTH_NAMES_LONG = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Genera la lista estricta de fechas disponibles en las próximas semanas
 * basándose únicamente en los días y horarios estipulados por el instructor.
 * El cliente no podrá seleccionar días fuera de esta lista.
 */
export function getInstructorAvailableDates(
  schedule?: InstructorScheduleDay[],
  daysHorizon = 28,
  referenceDate = new Date()
): AvailableDateOption[] {
  // Horario por defecto si el instructor no tiene configurado schedule
  const effectiveSchedule: InstructorScheduleDay[] = (Array.isArray(schedule) && schedule.length > 0)
    ? schedule
    : [
        { day: 'Lunes', dayIndex: 1, times: ['15:00', '16:00', '17:00'] },
        { day: 'Miércoles', dayIndex: 3, times: ['15:00', '16:00', '17:00'] },
        { day: 'Viernes', dayIndex: 5, times: ['14:00', '15:00', '16:00'] }
      ];

  // Mapa de días autorizados con sus horarios
  const allowedDayMap = new Map<number, { dayName: string; times: string[] }>();
  for (const s of effectiveSchedule) {
    if (!s || !Array.isArray(s.times) || s.times.length === 0) continue;
    let idx = typeof s.dayIndex === 'number' ? s.dayIndex : -1;
    if (idx < 0 || idx > 6) {
      const normalizedDay = (s.day || '').trim().toLowerCase();
      if (normalizedDay in SPANISH_DAY_INDEX_MAP) {
        idx = SPANISH_DAY_INDEX_MAP[normalizedDay];
      }
    }
    if (idx >= 0 && idx <= 6) {
      allowedDayMap.set(idx, {
        dayName: s.day || SPANISH_DAY_NAMES[idx],
        times: [...s.times]
      });
    }
  }

  const results: AvailableDateOption[] = [];
  const base = new Date(referenceDate);
  base.setHours(0, 0, 0, 0);

  // Comenzar desde el día siguiente para dar margen prudencial de agendamiento
  for (let offset = 1; offset <= daysHorizon; offset++) {
    const candidate = new Date(base);
    candidate.setDate(base.getDate() + offset);

    const dayOfWeek = candidate.getDay();
    const allowed = allowedDayMap.get(dayOfWeek);

    if (allowed && allowed.times.length > 0) {
      const year = candidate.getFullYear();
      const monthIndex = candidate.getMonth();
      const monthNum = String(monthIndex + 1).padStart(2, '0');
      const dayNum = String(candidate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${monthNum}-${dayNum}`;

      const shortDayName = allowed.dayName.slice(0, 3);
      const monthShort = SPANISH_MONTH_NAMES_SHORT[monthIndex];
      const monthLong = SPANISH_MONTH_NAMES_LONG[monthIndex];

      results.push({
        dateStr,
        dayName: allowed.dayName,
        dayIndex: dayOfWeek,
        formattedShort: `${shortDayName}, ${candidate.getDate()} ${monthShort}`,
        formattedLong: `${allowed.dayName}, ${candidate.getDate()} de ${monthLong}`,
        times: allowed.times
      });
    }
  }

  return results;
}
