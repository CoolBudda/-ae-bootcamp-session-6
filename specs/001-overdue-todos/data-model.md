# Phase 1 Data Model: Support for Overdue Todo Items

This feature introduces **no new persisted entities or fields**. It defines a derived
(computed, non-stored) attribute over the existing Todo entity.

## Entity: Todo (existing — unchanged)

| Field       | Type                | Notes (existing)                                  |
|-------------|---------------------|---------------------------------------------------|
| `id`        | number              | Identifier                                        |
| `title`     | string (≤255)       | Required                                          |
| `dueDate`   | string \| null      | Optional date (ISO `YYYY-MM-DD`); null when unset |
| `completed` | boolean \| number   | Completion status; UI compares `completed === 1`  |
| `createdAt` | string              | Creation timestamp (used for ordering)            |

No schema or API changes are made to this entity.

## Derived Attribute: `isOverdue` (computed, not stored)

- **Definition**: `true` when ALL of the following hold; otherwise `false`:
  1. `completed` is falsy (not `true` and not `1`) — see FR-002.
  2. `dueDate` is a non-empty value — see FR-003.
  3. `dueDate` (as a local calendar date) is strictly before today's local calendar date —
     see FR-001 and FR-004 (equal to today ⇒ not overdue).
- **Inputs**: the Todo's `dueDate` and `completed`, plus the current date `now`.
- **Granularity**: calendar day in the user's local timezone; time-of-day is ignored.
- **Lifecycle**: recomputed on every render of the todo list (FR-008); removed implicitly when
  the todo is completed or its due date moves to today/future (FR-009).

## Validation Rules

- A `null`/empty `dueDate` ⇒ never overdue.
- A completed todo ⇒ never overdue, regardless of `dueDate`.
- `dueDate === today` ⇒ not overdue.

## State Transitions (of the derived indicator)

```text
incomplete + dueDate < today      → overdue shown
incomplete + dueDate = today      → overdue hidden
incomplete + dueDate > today      → overdue hidden
incomplete + no dueDate           → overdue hidden
completed (any dueDate)           → overdue hidden
edit dueDate to past (incomplete) → overdue shown
edit dueDate to today/future      → overdue hidden
mark complete                     → overdue hidden
date advances past dueDate        → overdue shown (on next render)
```
