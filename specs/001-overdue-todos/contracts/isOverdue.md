# Contract: `isOverdue` Frontend Utility

This feature exposes no new external API (no backend/HTTP changes). The only new interface is
an internal frontend utility contract that `TodoCard` depends on. It is documented here so its
behavior is testable and stable.

## Module

`packages/frontend/src/utils/dateUtils.js`

## Signature

```js
/**
 * Determine whether a todo is overdue.
 * A todo is overdue when it is incomplete, has a due date, and that due date is
 * strictly before the current local calendar date (time-of-day ignored).
 *
 * @param {{ dueDate?: string|null, completed?: boolean|number }} todo - Todo item.
 * @param {Date} [now=new Date()] - Reference "current" date (injectable for tests).
 * @returns {boolean} True if the todo is overdue, otherwise false.
 */
export function isOverdue(todo, now = new Date()) { /* ... */ }
```

## Behavioral Contract

| # | Given (todo)                                  | now            | Returns | Requirement |
|---|-----------------------------------------------|----------------|---------|-------------|
| 1 | `{ completed: false, dueDate: '2026-06-11' }` | `2026-06-12`   | `true`  | FR-001      |
| 2 | `{ completed: false, dueDate: '2026-06-12' }` | `2026-06-12`   | `false` | FR-004      |
| 3 | `{ completed: false, dueDate: '2026-06-13' }` | `2026-06-12`   | `false` | FR-001      |
| 4 | `{ completed: true,  dueDate: '2026-06-01' }` | `2026-06-12`   | `false` | FR-002      |
| 5 | `{ completed: 1,     dueDate: '2026-06-01' }` | `2026-06-12`   | `false` | FR-002      |
| 6 | `{ completed: false, dueDate: null }`         | `2026-06-12`   | `false` | FR-003      |
| 7 | `{ completed: false }` (no dueDate)           | `2026-06-12`   | `false` | FR-003      |
| 8 | `{ completed: false, dueDate: '2026-06-12' }` | `2026-06-13`   | `true`  | FR-008      |

## Invariants

- Pure function: no side effects, no I/O, no reliance on global mutable state beyond the
  optional injected `now`.
- Calendar-day comparison in local time; equal dates are not overdue.
- Treats `completed === true` and `completed === 1` identically as "complete".
