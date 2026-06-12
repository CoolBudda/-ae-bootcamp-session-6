/**
 * Date utilities for derived todo display state.
 */

/**
 * Parse an ISO `YYYY-MM-DD` date string into a local calendar Date at midnight.
 * Avoids UTC parsing so calendar-day comparisons use the user's local timezone.
 *
 * @param {string} dateString - ISO date string (`YYYY-MM-DD`).
 * @returns {Date|null} Local Date at midnight, or null when unparseable.
 */
function parseLocalDate(dateString) {
  if (typeof dateString !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateString.trim());
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * Determine whether a todo is overdue.
 * A todo is overdue when it is incomplete, has a due date, and that due date is
 * strictly before the current local calendar date (time-of-day ignored).
 *
 * @param {{ dueDate?: string|null, completed?: boolean|number }} todo - Todo item.
 * @param {Date} [now=new Date()] - Reference "current" date (injectable for tests).
 * @returns {boolean} True if the todo is overdue, otherwise false.
 */
export function isOverdue(todo, now = new Date()) {
  if (!todo) return false;
  if (todo.completed === true || todo.completed === 1) return false;
  if (!todo.dueDate) return false;

  const due = parseLocalDate(todo.dueDate);
  if (!due) return false;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return due.getTime() < today.getTime();
}
