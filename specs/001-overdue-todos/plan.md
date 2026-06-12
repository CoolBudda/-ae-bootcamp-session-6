# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-06-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Visually distinguish incomplete todos whose due date is before the current local date so
users can spot overdue work at a glance, without manual date comparison. "Overdue" is a
derived display state computed in the React frontend from each todo's existing `dueDate` and
`completed` fields plus today's date — no backend, API, or storage changes. The indicator is
applied in `TodoCard` (rendered by `TodoList`), conveyed with more than color alone (a text/
icon cue plus styling), and styled via theme tokens so it works in light and dark modes and
meets WCAG AA contrast. Status is recomputed on each render of the list, so it reflects the
current day automatically.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: JavaScript (ES2020+), React 18 function components with hooks; Node.js
v16+ / npm v7+ (monorepo via npm workspaces)

**Primary Dependencies**: React, React DOM (frontend). No new runtime dependencies are added.

**Storage**: N/A — overdue is a derived (non-persisted) state computed from existing todo
fields; no backend or schema changes.

**Testing**: Jest + @testing-library/react (frontend), co-located in `__tests__/` directories

**Target Platform**: Desktop-focused web browsers (existing single-column React app)

**Project Type**: Web application (monorepo: `packages/frontend` + `packages/backend`); this
feature touches the frontend only.

**Performance Goals**: No measurable impact; overdue is an O(1) per-todo comparison during the
existing render. UI remains responsive (instant, no added network calls).

**Constraints**: No new persisted fields or API changes (FR-010); indicator must not rely on
color alone (FR-006) and must meet WCAG AA contrast in light and dark modes (FR-007);
evaluated at calendar-day granularity using the user's local date.

**Scale/Scope**: Single-user app, single todo list. Scope limited to `TodoCard` rendering and
a small date-comparison utility plus styles; no filtering/sorting/counting.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md) v1.0.0:

- **I. Code Quality & Maintainability**: PASS — overdue logic extracted into a single pure
  helper (DRY/KISS), no speculative abstraction; JSDoc on the public helper.
- **II. Test-First & Comprehensive Coverage (NON-NEGOTIABLE)**: PASS — unit tests for the
  helper (past/today/future/no-date/completed) and component tests for the rendered indicator
  are written before implementation; behavior-focused and isolated.
- **III. Single Responsibility & Modular Architecture**: PASS — date logic lives in a frontend
  utility; `TodoCard` only consumes the derived value for presentation; no backend coupling.
- **IV. Consistent Style & Conventions**: PASS — `camelCase`, 2-space indent, ordered imports,
  ESLint-clean, no `console.log` in production paths.
- **V. User Experience Consistency**: PASS — uses design-system theme tokens, supports light/
  dark mode, non-color cue + accessible labels, no change to destructive-action behavior.

No violations; Complexity Tracking left empty.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
Only the frontend package is touched. Relevant existing and new files:

```text
packages/frontend/src/
├── components/
│   ├── TodoCard.js              # MODIFIED: apply overdue indicator (styling + non-color cue)
│   ├── TodoList.js              # unchanged (renders TodoCard)
│   └── __tests__/
│       └── TodoCard.test.js     # MODIFIED: add overdue rendering tests
├── utils/
│   ├── dateUtils.js             # NEW: isOverdue(todo, now) pure helper (JSDoc)
│   └── __tests__/
│       └── dateUtils.test.js    # NEW: unit tests for isOverdue
├── styles/
│   └── theme.css                # MODIFIED: add overdue theme tokens (light + dark)
└── App.css                      # MODIFIED: .todo-card.overdue styling (if needed)
```

**Structure Decision**: Web application monorepo; this feature is frontend-only. Overdue
classification is isolated in a new `utils/dateUtils.js` pure helper (testable in isolation),
consumed by `TodoCard` for presentation. Styling uses theme tokens in `styles/theme.css` to
guarantee light/dark support and WCAG AA contrast. No backend (`packages/backend`) changes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations. This section is intentionally empty.
