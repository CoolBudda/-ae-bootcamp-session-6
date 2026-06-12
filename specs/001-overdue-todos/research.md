# Phase 0 Research: Support for Overdue Todo Items

All Technical Context items were resolved from the existing codebase and the confirmed stack
(React + Express, Jest; frontend-derived state). No `NEEDS CLARIFICATION` items remained.

## Decision 1: Compute overdue in the frontend as derived state

- **Decision**: Determine overdue status in the React frontend from each todo's existing
  `dueDate` and `completed` fields and the current local date. Do not persist it or add an API
  field.
- **Rationale**: FR-010 forbids new persisted fields/storage changes. The data needed
  (`dueDate`, `completed`) is already returned by `GET /api/todos`. Deriving on render keeps
  status current with no extra round-trips and no backend work.
- **Alternatives considered**: Add an `overdue` flag from the Express API — rejected: the flag
  would be stale relative to "now" unless recomputed on every request and still duplicates
  logic the client must apply; violates the no-storage-change constraint and adds coupling.

## Decision 2: Calendar-day comparison using local date

- **Decision**: A todo is overdue when it is incomplete, has a `dueDate`, and that due date is
  strictly before today's local calendar date (time-of-day ignored). Due date equal to today
  is NOT overdue (FR-004).
- **Rationale**: Matches the spec's edge cases and user mental model ("past their due date").
  Comparing normalized date-only values avoids timezone/time-of-day false positives.
- **Alternatives considered**: Timestamp comparison including time — rejected: would mark a
  same-day todo overdue mid-day, contradicting FR-004.

## Decision 3: Isolate logic in a pure helper `utils/dateUtils.js`

- **Decision**: Expose `isOverdue(todo, now = new Date())` returning a boolean; `TodoCard`
  consumes it for presentation only.
- **Rationale**: Constitution III (single responsibility) and II (isolated, behavior-focused
  tests). Injecting `now` makes time-dependent behavior deterministically testable (covers
  User Story 3 / FR-008 without manipulating the system clock).
- **Alternatives considered**: Inline the comparison in `TodoCard` — rejected: harder to unit
  test and duplicates logic if reused.

## Decision 4: Accessible, non-color indicator via theme tokens

- **Decision**: Mark overdue cards with an `overdue` CSS class plus a visible textual/icon cue
  (e.g., an "Overdue" label near the due date) and an `aria` cue; colors come from new tokens
  in `styles/theme.css` defined for both light and dark themes.
- **Rationale**: FR-006 (not color alone), FR-007 (WCAG AA in both modes), and Constitution V
  (design-system consistency, light/dark support). The existing app already toggles themes via
  CSS variables, so adding tokens is consistent and centralized.
- **Alternatives considered**: Color-only red text — rejected: fails FR-006 and accessibility.

## Decision 5: Re-evaluate on each list render

- **Decision**: Compute overdue during render of the list/cards; no caching of the result.
- **Rationale**: FR-008 requires status to reflect the current day; recomputing on render is
  trivially cheap (O(1) per todo) and naturally updates after toggles/edits (FR-009).
- **Alternatives considered**: Memoize with a daily timer — rejected: unnecessary complexity
  (YAGNI) for a single-user, render-on-interaction app.

## Note on existing data shape

- `completed` is represented numerically in the current UI (`todo.completed === 1`). The
  helper MUST treat any truthy/`1` completed value as complete so completed todos are never
  overdue (FR-002). Tests cover both `true` and `1`.
