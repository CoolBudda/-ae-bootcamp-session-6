import { isOverdue } from '../dateUtils';

describe('isOverdue', () => {
  const now = new Date(2026, 5, 12); // 2026-06-12 (local)

  it('returns true for an incomplete todo due before today (FR-001)', () => {
    expect(isOverdue({ completed: false, dueDate: '2026-06-11' }, now)).toBe(true);
  });

  it('returns false for an incomplete todo due today (FR-004)', () => {
    expect(isOverdue({ completed: false, dueDate: '2026-06-12' }, now)).toBe(false);
  });

  it('returns false for an incomplete todo due in the future (FR-001)', () => {
    expect(isOverdue({ completed: false, dueDate: '2026-06-13' }, now)).toBe(false);
  });

  it('returns false for a completed (true) past-due todo (FR-002)', () => {
    expect(isOverdue({ completed: true, dueDate: '2026-06-01' }, now)).toBe(false);
  });

  it('returns false for a completed (1) past-due todo (FR-002)', () => {
    expect(isOverdue({ completed: 1, dueDate: '2026-06-01' }, now)).toBe(false);
  });

  it('returns false when dueDate is null (FR-003)', () => {
    expect(isOverdue({ completed: false, dueDate: null }, now)).toBe(false);
  });

  it('returns false when dueDate is missing (FR-003)', () => {
    expect(isOverdue({ completed: false }, now)).toBe(false);
  });

  it('reports a due-today todo as overdue when the date advances to the next day (FR-008)', () => {
    const nextDay = new Date(2026, 5, 13); // 2026-06-13 (local)
    expect(isOverdue({ completed: false, dueDate: '2026-06-12' }, nextDay)).toBe(true);
  });

  it('defaults now to the current date when omitted', () => {
    expect(isOverdue({ completed: false, dueDate: '2000-01-01' })).toBe(true);
    expect(isOverdue({ completed: false, dueDate: '2999-01-01' })).toBe(false);
  });

  it('returns false for a missing todo', () => {
    expect(isOverdue(null, now)).toBe(false);
    expect(isOverdue(undefined, now)).toBe(false);
  });

  it('returns false for an unparseable dueDate string', () => {
    expect(isOverdue({ completed: false, dueDate: 'not-a-date' }, now)).toBe(false);
  });

  it('returns false for a non-string dueDate value', () => {
    expect(isOverdue({ completed: false, dueDate: 20260611 }, now)).toBe(false);
  });
});
