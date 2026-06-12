# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-06-12

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items — As a todo application user I want to easily identify and distinguish overdue tasks in my todo list so that I can prioritize my work and quickly see which tasks are past their due date. Users need a clear, visual way to identify which todos have not been completed by their due date, helping them spot overdue items without manually checking dates against today's date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visually identify overdue todos (Priority: P1)

A user opens their todo list and, without comparing any dates manually, can immediately
see which incomplete todos are past their due date because those items are visually
distinguished from the rest of the list.

**Why this priority**: This is the core value of the feature — surfacing overdue work at a
glance. Without it, none of the other refinements matter. It is the minimum viable slice
that delivers the requested benefit.

**Independent Test**: Create a todo with a due date in the past and another with a due date
in the future (both incomplete), load the list, and confirm that only the past-due todo is
shown with the overdue treatment.

**Acceptance Scenarios**:

1. **Given** an incomplete todo whose due date is before today, **When** the user views the
   todo list, **Then** that todo is visually marked as overdue (distinct styling and a clear
   textual/indicator cue).
2. **Given** an incomplete todo whose due date is today, **When** the user views the todo
   list, **Then** that todo is NOT marked as overdue.
3. **Given** an incomplete todo whose due date is after today, **When** the user views the
   todo list, **Then** that todo is NOT marked as overdue.

---

### User Story 2 - Overdue status excludes completed and undated todos (Priority: P2)

A user has completed some past-due tasks and has other tasks with no due date. The list
should only flag genuinely outstanding overdue work, so completed items and items without a
due date are never marked overdue.

**Why this priority**: Prevents false signals that would undermine trust in the overdue
indicator, but the feature is still usable for its primary purpose without this refinement.

**Independent Test**: Mark a past-due todo as complete and add a todo with no due date; load
the list and confirm neither is flagged as overdue.

**Acceptance Scenarios**:

1. **Given** a completed todo whose due date is in the past, **When** the user views the
   list, **Then** the todo is NOT marked as overdue.
2. **Given** an incomplete todo with no due date, **When** the user views the list, **Then**
   the todo is NOT marked as overdue.
3. **Given** an overdue incomplete todo, **When** the user marks it complete, **Then** the
   overdue indication is removed.

---

### User Story 3 - Overdue status stays current over time (Priority: P3)

A user keeps the app open or returns to it on a later day. Todos that become overdue as the
current date advances are reflected correctly without requiring data changes.

**Why this priority**: Ensures correctness over time, but the primary value is already
delivered by evaluating overdue status when the list is viewed.

**Independent Test**: Create a todo due today, then re-evaluate the list as if the date were
the following day, and confirm the todo is now marked overdue.

**Acceptance Scenarios**:

1. **Given** an incomplete todo due today, **When** the current date advances past the due
   date and the list is viewed again, **Then** the todo is marked as overdue.

---

### Edge Cases

- A todo due exactly today is treated as NOT overdue (the user still has the day to complete
  it).
- A todo with no due date is never overdue.
- A completed todo is never overdue, regardless of its due date.
- When an overdue todo's due date is edited to today or a future date, the overdue indicator
  is removed; when a todo's due date is edited to a past date, it becomes overdue.
- The overdue indicator must remain distinguishable in both light and dark modes and meet
  accessibility contrast standards, and must not rely on color alone to convey meaning.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST classify an incomplete todo as overdue when its due date is earlier
  than the current date.
- **FR-002**: System MUST NOT classify a todo as overdue if it is marked complete.
- **FR-003**: System MUST NOT classify a todo as overdue if it has no due date.
- **FR-004**: System MUST treat a todo whose due date equals the current date as NOT overdue.
- **FR-005**: System MUST visually distinguish overdue todos from non-overdue todos in the
  todo list using a clear, consistent treatment.
- **FR-006**: System MUST convey overdue status using more than color alone (e.g., a label,
  icon, or text cue) so the status is perceivable by users who cannot distinguish colors.
- **FR-007**: The overdue indication MUST be legible and meet accessibility contrast
  standards in both light and dark modes.
- **FR-008**: System MUST re-evaluate overdue status against the current date each time the
  todo list is displayed, so status reflects the present day without requiring edits.
- **FR-009**: System MUST remove the overdue indication immediately when a todo is marked
  complete or when its due date is changed to the current date or a future date.
- **FR-010**: Overdue classification MUST be derived from existing todo data (due date and
  completion status) and MUST NOT require new persisted fields or storage changes.

### Key Entities *(include if feature involves data)*

- **Todo**: An existing task item. Relevant attributes for this feature are its due date
  (optional) and completion status. "Overdue" is a derived state computed from the due date,
  the completion status, and the current date; it is not stored.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of incomplete todos with a due date before the current date are displayed
  with the overdue treatment, and 0% of completed, undated, due-today, or future-dated todos
  are flagged.
- **SC-002**: A user can identify all overdue todos in their list within 5 seconds of opening
  it, without performing any manual date comparison.
- **SC-003**: The overdue indicator is perceivable without relying on color alone and meets
  WCAG AA contrast in both light and dark modes.
- **SC-004**: When a user completes an overdue todo or changes its due date to today/future,
  the overdue indication is removed immediately upon the resulting list update.

## Assumptions

- "Current date" is the user's local date; overdue is evaluated at calendar-day granularity
  (time of day is not considered).
- The application remains single-user with no authentication, consistent with existing
  functional requirements; overdue status is global to the single list.
- Existing todo data (optional due date and completion status) is sufficient; no backend
  schema or storage changes are introduced.
- The feature applies to the existing single-column desktop-focused list view and follows
  the established design system, including light/dark mode support.
- No filtering, sorting, sectioning, or counting by overdue status is included in this
  feature; it is limited to visually distinguishing overdue items in the existing list.
