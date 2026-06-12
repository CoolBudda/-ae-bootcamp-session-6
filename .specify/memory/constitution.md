<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Ratification: Initial constitution created from project docs (docs/coding-guidelines.md,
  docs/testing-guidelines.md, docs/functional-requirements.md, docs/ui-guidelines.md,
  docs/project-overview.md)
- Modified principles: N/A (initial adoption)
- Added principles:
  I. Code Quality & Maintainability
  II. Test-First & Comprehensive Coverage
  III. Single Responsibility & Modular Architecture
  IV. Consistent Style & Conventions
  V. User Experience Consistency
- Added sections: Technology & Scope Constraints; Development Workflow & Quality Gates
- Removed sections: None
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (Constitution Check gate is generic; no change required)
  ✅ .specify/templates/spec-template.md (no conflicting constraints)
  ✅ .specify/templates/tasks-template.md (task categories align with testing/quality principles)
  ✅ .github/prompts/speckit.constitution.prompt.md (generic; no change required)
- Follow-up TODOs: None
-->

# Todo App Constitution

## Core Principles

### I. Code Quality & Maintainability

All code MUST favor clarity and maintainability over cleverness.

- DRY: duplicated logic MUST be extracted into shared functions, components, or utilities.
- KISS: prefer the simplest implementation that satisfies requirements; avoid premature
  optimization and speculative abstraction (YAGNI).
- SOLID: every module/component MUST have a single responsibility; depend on abstractions
  (props, injected dependencies) rather than concrete implementations.
- Error handling MUST be explicit at operation boundaries (try/catch around fallible calls),
  with meaningful messages and user-facing feedback where applicable.
- Comments explain "why", not "what"; public functions and components MUST use JSDoc.

**Rationale**: The codebase is a teaching template; readable, well-factored code is the
primary deliverable and the strongest defense against regressions.

### II. Test-First & Comprehensive Coverage (NON-NEGOTIABLE)

Tests MUST describe expected behavior and accompany every change.

- Follow Red-Green-Refactor: write a failing test, write minimal code to pass, then refactor.
- Bug fixes MUST add a failing test reproducing the bug before the fix is applied.
- Target 80%+ code coverage across all packages; critical user workflows MUST reach 100%.
- Tests MUST verify behavior, not implementation details, and MUST be isolated: each test
  sets up its own data, mocks external dependencies, and runs independently in any order.
- All tests MUST pass locally before a pull request is opened.

**Rationale**: Tests document intent, prevent regressions, and are the contract that lets
features evolve safely across frontend and backend packages.

### III. Single Responsibility & Modular Architecture

The monorepo structure and separation of concerns MUST be preserved.

- Frontend lives in `packages/frontend`, backend in `packages/backend`; cross-cutting code
  is shared through explicit modules, never circular dependencies.
- Components handle presentation; services handle data access and business logic; routes
  and controllers stay thin.
- Functions and components MUST do one thing well; prefer pure functions and dependency
  injection to keep units testable.

**Rationale**: Clear module boundaries keep the application understandable, testable, and
extensible without entangling unrelated concerns.

### IV. Consistent Style & Conventions

Code style MUST be uniform and enforced before merge.

- Indentation is 2 spaces; lines target under 100 characters; no trailing whitespace; LF
  line endings.
- Naming: `camelCase` for variables/functions, `UPPER_SNAKE_CASE` for constants,
  `PascalCase` for React components and classes (file names match component names).
- Imports are grouped and ordered: external libraries, then internal modules, then styles,
  separated by blank lines; use relative paths for internal modules.
- ESLint MUST pass with no errors or warnings; no `console.log` statements may remain in
  production code.

**Rationale**: Consistency removes friction in review and onboarding and keeps diffs focused
on substance rather than formatting.

### V. User Experience Consistency

The UI MUST follow the established design system and accessibility standards.

- Apply the defined color palette, typography scale, and 8px spacing grid; support both
  light and dark modes with the user's preference persisted in `localStorage`.
- Maintain the single-column, Material Design-inspired layout with the Halloween theme.
- Accessibility is mandatory: all interactive elements are keyboard accessible, color
  contrast meets WCAG AA, form labels are associated with inputs, and icon buttons have
  descriptive `aria-label`/`title` attributes; focus indicators MUST be visible.
- Destructive actions (e.g., delete) MUST require explicit confirmation.

**Rationale**: A consistent, accessible interface is part of the product contract and
ensures the app is usable and predictable for all users.

## Technology & Scope Constraints

- Stack: React frontend communicating with an Express.js REST API; Jest for testing across
  both packages; npm workspaces for the monorepo. Node.js v16+ and npm v7+ are required.
- Scope: single-user todo application. Out of scope: authentication/authorization,
  multi-user/collaboration, priorities/categories, recurring todos, reminders/notifications,
  undo/redo, bulk operations, and advanced filtering/search.
- All todo changes (create, update, status toggle, edit, delete) MUST persist to the backend
  immediately and survive a page refresh.
- No database schema changes beyond basic todo storage.

## Development Workflow & Quality Gates

- Branching: use feature branches (e.g., `feature/todo-editing`); merge via pull request.
- Commits MUST be atomic and use descriptive messages that explain the "why".
- Before opening a PR: lint passes, all tests pass, coverage goals are respected, and the
  Code Review Checklist (naming, imports, DRY, single responsibility, error handling,
  comments, tests, no stray `console.log`) is satisfied.
- Pull requests MUST be used for code review before merging to the default branch.

## Governance

This constitution supersedes other ad-hoc practices for this project. The documents under
`docs/` provide the detailed, living guidance that operationalizes these principles.

- Amendments MUST be proposed via pull request, documented in this file's Sync Impact Report,
  and approved through normal review.
- Versioning follows semantic versioning: MAJOR for incompatible governance/principle
  removals or redefinitions, MINOR for new or materially expanded principles/sections, PATCH
  for clarifications and non-semantic refinements.
- All PRs and reviews MUST verify compliance with these principles; deviations MUST be
  justified explicitly or the change revised.
- Use the documents in `docs/` for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-06-12 | **Last Amended**: 2026-06-12
