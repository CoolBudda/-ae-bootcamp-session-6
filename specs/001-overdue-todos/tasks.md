---
description: "Task list for Support for Overdue Todo Items"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are INCLUDED because the project constitution mandates Test-First
development (Principle II, NON-NEGOTIABLE) and the Testing Guidelines require behavior tests
with 100% coverage on critical paths. Write tests first; they MUST fail before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing. This feature is frontend-only (`packages/frontend`); no backend changes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

- Frontend package root: `packages/frontend/`
- Source: `packages/frontend/src/`; tests co-located in `__tests__/` directories

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the files this feature introduces

- [ ] T001 [P] Create the overdue helper file scaffold `packages/frontend/src/utils/dateUtils.js` with an exported `isOverdue` stub and JSDoc (no logic yet)
- [ ] T002 [P] Create the test file scaffold `packages/frontend/src/utils/__tests__/dateUtils.test.js` (empty describe block for `isOverdue`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core derived-state logic that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until the `isOverdue` helper exists and passes
its unit tests, since every story consumes it.

- [ ] T003 [US-shared] Write failing unit tests for `isOverdue(todo, now)` in `packages/frontend/src/utils/__tests__/dateUtils.test.js` covering all 8 contract cases from `specs/001-overdue-todos/contracts/isOverdue.md` (past, today, future, completed `true`, completed `1`, `dueDate: null`, missing `dueDate`, date-advances)
- [ ] T004 [US-shared] Implement `isOverdue(todo, now = new Date())` in `packages/frontend/src/utils/dateUtils.js` using local calendar-day comparison so it satisfies FR-001–FR-004 and FR-008 and makes T003 pass

**Checkpoint**: `isOverdue` is fully tested and green — user story UI work can begin.

---

## Phase 3: User Story 1 - Visually identify overdue todos (Priority: P1) 🎯 MVP

**Goal**: Incomplete, past-due todos are visually distinguished in the list with a non-color
cue, so users spot overdue work at a glance.

**Independent Test**: Add an incomplete past-due todo and an incomplete future-due todo; load
the list and confirm only the past-due one shows the overdue treatment.

### Tests for User Story 1 ⚠️ (write first, must fail)

- [ ] T005 [US1] Add failing component tests in `packages/frontend/src/components/__tests__/TodoCard.test.js` asserting that an incomplete past-due todo renders the overdue indicator (overdue CSS class AND a non-color textual/`aria` cue) and that a future-due incomplete todo does not (FR-001, FR-005, FR-006)

### Implementation for User Story 1

- [ ] T006 [US1] Import `isOverdue` and compute the derived flag in `packages/frontend/src/components/TodoCard.js`, applying an `overdue` class to the card and rendering a visible "Overdue" label/icon plus an accessible cue near the due date (FR-005, FR-006); make T005 pass
- [ ] T007 [P] [US1] Add overdue theme tokens (light + dark) in `packages/frontend/src/styles/theme.css` and `.todo-card.overdue` styling in `packages/frontend/src/App.css` meeting WCAG AA contrast (FR-007)

**Checkpoint**: User Story 1 is fully functional and independently testable (MVP).

---

## Phase 4: User Story 2 - Exclude completed and undated todos (Priority: P2)

**Goal**: Only genuinely outstanding work is flagged — completed and undated todos are never
marked overdue, and completing an overdue todo clears the indicator.

**Independent Test**: Mark a past-due todo complete and add an undated todo; confirm neither
is flagged, and the indicator disappears immediately on completion.

### Tests for User Story 2 ⚠️ (write first, must fail)

- [ ] T008 [US2] Add failing component tests in `packages/frontend/src/components/__tests__/TodoCard.test.js` asserting a completed past-due todo and an incomplete undated todo render NO overdue indicator, and that toggling an overdue todo to complete removes it (FR-002, FR-003, FR-009)

### Implementation for User Story 2

- [ ] T009 [US2] Confirm/adjust the `isOverdue` consumption in `packages/frontend/src/components/TodoCard.js` so completion (`true` or `1`) and missing/null `dueDate` suppress the indicator and re-render on toggle clears it; make T008 pass (FR-002, FR-003, FR-009)

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Overdue status stays current over time (Priority: P3)

**Goal**: Todos that become overdue as the date advances are reflected on the next render
without data changes.

**Independent Test**: With `now` set to the following day, a todo due today is reported
overdue.

### Tests for User Story 3 ⚠️ (write first, must fail)

- [ ] T010 [US3] Add a failing test (helper-level in `packages/frontend/src/utils/__tests__/dateUtils.test.js` and/or component-level in `packages/frontend/src/components/__tests__/TodoCard.test.js`) proving a due-today todo becomes overdue when `now` advances to the next day (FR-008)

### Implementation for User Story 3

- [ ] T011 [US3] Ensure overdue is computed on each render (no stale caching) in `packages/frontend/src/components/TodoCard.js` so status reflects the current date; make T010 pass (FR-008)

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize quality, accessibility, and validation

- [ ] T012 [P] Verify ESLint passes with no errors/warnings and no `console.log` left in changed files (`packages/frontend/src/utils/dateUtils.js`, `packages/frontend/src/components/TodoCard.js`)
- [ ] T013 [P] Confirm coverage goals: run `npm test --workspace=packages/frontend -- --coverage` and verify 100% on `dateUtils.js` and the overdue path in `TodoCard.js`
- [ ] T014 Run the manual validation steps in `specs/001-overdue-todos/quickstart.md`, including light/dark mode contrast and the non-color cue (FR-006, FR-007)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories (provides `isOverdue`)
- **User Stories (Phase 3–5)**: All depend on Foundational completion
  - US1 (P1) → US2 (P2) → US3 (P3) in priority order, or in parallel where files differ
- **Polish (Phase 6)**: Depends on all targeted user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational (T004). No dependency on US2/US3.
- **US2 (P2)**: Depends on Foundational; edits the same `TodoCard.js` as US1, so coordinate
  if worked in parallel (shared file).
- **US3 (P3)**: Depends on Foundational; touches the same files as US1/US2.

### Within Each User Story

- Tests are written FIRST and must FAIL before implementation.
- Helper (Foundational) before component consumption.
- Core rendering before styling polish.

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel.
- T007 (CSS) can run in parallel with T006 logic once the `overdue` class name is agreed.
- T012 and T013 (Polish) can run in parallel.
- Note: T006, T009, T011 all edit `TodoCard.js` and are therefore sequential, not parallel.

---

## Parallel Example: Setup Phase

```text
# Launch T001 and T002 together (different files):
T001 → packages/frontend/src/utils/dateUtils.js (stub)
T002 → packages/frontend/src/utils/__tests__/dateUtils.test.js (scaffold)
```

---

## Implementation Strategy

- **MVP scope**: Phases 1–3 (Setup → Foundational → User Story 1). This delivers the core
  value: overdue todos are visually distinguished with an accessible, non-color cue.
- **Incremental delivery**: Add US2 (exclusions/clearing) then US3 (time currency) as
  independent increments, each behind its own failing-tests-first cycle.
- **Frontend-only**: No backend or storage changes (FR-010); overdue is derived on render.
