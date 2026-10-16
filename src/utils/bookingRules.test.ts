import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEmail,
  isDateInPast,
  timeToMinutes,
  isSlotConflicting,
  calculateInstructorRating,
  formatCurrencyCOP
} from './bookingRules.ts';

test('validateEmail checks standard email addresses correctly', () => {
  assert.equal(validateEmail('estudiante@colegio.edu.co'), true);
  assert.equal(validateEmail('mateo.silva@bam.org'), true);
  assert.equal(validateEmail('invalido'), false);
  assert.equal(validateEmail('invalido@'), false);
  assert.equal(validateEmail(''), false);
});

test('timeToMinutes converts HH:mm accurately', () => {
  assert.equal(timeToMinutes('00:00'), 0);
  assert.equal(timeToMinutes('08:30'), 510);
  assert.equal(timeToMinutes('14:15'), 855);
  assert.equal(timeToMinutes('23:59'), 1439);
});

test('isDateInPast returns true for yesterday and false for future date', () => {
  assert.equal(isDateInPast('2020-01-01'), true);
  assert.equal(isDateInPast('2035-12-31'), false);
});

test('isSlotConflicting detects overlapping slots on same date', () => {
  const existing = [
    { date: '2026-11-10', time: '10:00', durationMinutes: 60, status: 'Aceptada' as const },
    { date: '2026-11-10', time: '14:00', durationMinutes: 60, status: 'Cancelada' as const }, // Cancelada no debe causar conflicto
  ];

  // Solapamiento exacto
  assert.equal(isSlotConflicting(existing, '2026-11-10', '10:00', 60), true);
  // Solapamiento parcial (inicia adentro)
  assert.equal(isSlotConflicting(existing, '2026-11-10', '10:30', 60), true);
  // Solapamiento parcial (termina adentro)
  assert.equal(isSlotConflicting(existing, '2026-11-10', '09:30', 60), true);
  // Fecha diferente (no conflicto)
  assert.equal(isSlotConflicting(existing, '2026-11-11', '10:00', 60), false);
  // Horario diferente mismo día (no conflicto)
  assert.equal(isSlotConflicting(existing, '2026-11-10', '11:00', 60), false);
  // Horario con reserva cancelada (no conflicto)
  assert.equal(isSlotConflicting(existing, '2026-11-10', '14:00', 60), false);
});

test('calculateInstructorRating calculates average and count properly', () => {
  const reviews = [
    { id: '1', rating: 5, comment: 'Excelente' },
    { id: '2', rating: 4, comment: 'Muy bueno' },
    { id: '3', rating: 5, comment: 'Recomendado' },
  ];
  const result = calculateInstructorRating(reviews);
  assert.equal(result.count, 3);
  assert.equal(result.average, 4.7);

  const emptyResult = calculateInstructorRating([]);
  assert.equal(emptyResult.count, 0);
  assert.equal(emptyResult.average, 0);
});

test('formatCurrencyCOP formats numbers into Colombian Peso strings', () => {
  const formatted = formatCurrencyCOP(25000);
  assert.ok(formatted.includes('25') && formatted.includes('000'));
});
