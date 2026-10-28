import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProgressPercent, getDaysRemainingFromDate, isTaskUrgent } from './taskRules.ts';

test('calculateProgressPercent calculates percentage clamped between 0 and 100', () => {
  assert.equal(calculateProgressPercent(0, 0), 0);
  assert.equal(calculateProgressPercent(10, 5), 50);
  assert.equal(calculateProgressPercent(3, 1), 33);
  assert.equal(calculateProgressPercent(4, 4), 100);
});

test('getDaysRemainingFromDate calculates days correctly', () => {
  const ref = new Date('2026-10-21T00:00:00');
  assert.equal(getDaysRemainingFromDate('2026-10-21', ref), 0);
  assert.equal(getDaysRemainingFromDate('2026-10-23', ref), 2);
  assert.equal(getDaysRemainingFromDate('2026-10-19', ref), -2);
});

test('isTaskUrgent detects high priority or near due dates', () => {
  const ref = new Date('2026-10-21T00:00:00');
  // High priority pending
  assert.equal(isTaskUrgent({ id: '1', title: 'Taller', priority: 'alta', completed: false, dueDate: '2026-10-30' }, ref), true);
  // High priority but already completed -> not urgent
  assert.equal(isTaskUrgent({ id: '2', title: 'Taller', priority: 'alta', completed: true, dueDate: '2026-10-30' }, ref), false);
  // Due tomorrow with medium priority -> urgent
  assert.equal(isTaskUrgent({ id: '3', title: 'Taller', priority: 'media', completed: false, dueDate: '2026-10-22' }, ref), true);
  // Due next week with low priority -> not urgent
  assert.equal(isTaskUrgent({ id: '4', title: 'Taller', priority: 'baja', completed: false, dueDate: '2026-10-30' }, ref), false);
});
