---
name: brainstorm
description: Planning workflow. Enters plan mode to turn vague ideas into actionable task lists with agent assignments. Use when starting a new feature or implementation.
---

# Brainstorm Workflow

## Overview

This workflow transforms a vague idea into a structured implementation plan with agent assignments, written to a plan file for approval.

**Input:** A vague idea or feature request (e.g., "we need better search" or "add salary filters")

**Output:** A plan file (`.claude/plans/*.md`) containing:

- Feature summary
- Task list with agent assignments and pipelines
- Ready for sequential execution after approval

---

## Workflow

### Step 1: Enter Plan Mode

If not already in plan mode, enter it now. The plan file will contain the final task list.

### Step 2: Understand

**Goal:** Clarify what we're building.

Questions to ask:

- What's the core functionality?
- What are the key interactions?
- What states need handling? (loading, error, empty, success)

**Rules:**

- One question per message
- Prefer multiple choice when possible
- Check project context first (files, docs, recent commits)
- Skip unnecessary questions if intent is clear
- Hint recommendation if confident

### Step 3: Challenge

**Goal:** Surface decisions that need user input.

**Skip obvious questions.** Handle standard cases with sensible defaults. Only ask when:

- There's a genuine decision with trade-offs
- The answer isn't obvious from context
- Getting it wrong would require significant rework

**Examples of questions to skip:**

- "What if the API fails?" → Show error message (obvious)
- "What about loading state?" → Show loading indicator (obvious)

**Examples of questions to ask:**

- "Should filters persist in URL or local state?" → Affects architecture
- "Inline edit or modal?" → UX decision with trade-offs

### Step 4: Define Tasks

**Goal:** Break down into executable tasks with agent assignments.

For each task, determine:

1. **What** to build
2. **Which agent** should handle it
3. **What follows** (sequential pipeline)

**Agent Selection Guide:**

| Work Type                 | Agent          | Followed By               |
| ------------------------- | -------------- | ------------------------- |
| Build component/hook/util | `implementer`  | `tester`                  |
| Build page                | `implementer`  | `tester` → `seo-reviewer` |
| Write tests               | `tester`       | -                         |
| Review SEO (pages only)   | `seo-reviewer` | -                         |

**Standard Pipeline for Implementation:**

```
implementer → tester [→ seo-reviewer if page]
```

**Note:** `code-simplifier` and `design-reviewer` run once after ALL tasks complete (see Post-Implementation Review).

### Step 5: Write Plan File

Write the task list to the plan file using this format:

```markdown
# Feature: [Feature Name]

## Summary

[One paragraph describing what we're building and key decisions made]

## Tasks

### Task 1: [Title]

**Description:** [What to build - one sentence]
**Agent:** implementer
**Pipeline:** implementer → tester

### Task 2: [Title]

**Description:** [What to build - one sentence]
**Agent:** implementer
**Pipeline:** implementer → tester → seo-reviewer (if page)

## Post-Implementation Review

After all tasks complete, run these agents on all modified code:

1. `code-simplifier` - Refines all recently modified code for clarity and consistency
2. `design-reviewer` - Reviews all UI components holistically for design compliance

## Final Verification

Run lint, build, and tests:

1. `pnpm lint` - Fix any linting errors
2. `pnpm build` - Ensure production build succeeds
3. `pnpm test` - Ensure all tests pass

## Execution

After approval, execute tasks sequentially:

1. Spawn agent for Task 1, run pipeline
2. Spawn agent for Task 2, run pipeline
3. Continue until all tasks complete
4. Run post-implementation review (simplifier → design-reviewer)
5. Run final verification (lint → build → test)
```

### Step 6: Exit Plan Mode

Call `ExitPlanMode` to request user approval of the plan.

---

## Task Requirements

Each task must be:

- **Clear** - One sentence describing what to build/do
- **Assigned** - Has a designated agent
- **Sequenced** - Pipeline is defined

---

## Example Plan File

```markdown
# Feature: Salary Range Filter

## Summary

Add a salary range filter to the job search. Users can set min/max salary using a dual-handle slider or direct input. Filter persists in URL for shareable links.

## Tasks

### Task 1: Create SalaryRangeFilter component

**Description:** Build a dual-handle slider component for filtering jobs by salary range, with min/max inputs.
**Agent:** implementer
**Pipeline:** implementer → tester

### Task 2: Add salary filter to filters sidebar

**Description:** Integrate SalaryRangeFilter into the existing filters-aside component.
**Agent:** implementer
**Pipeline:** implementer → tester

## Post-Implementation Review

After all tasks complete:

1. `code-simplifier` - Refine SalaryRangeFilter and integration code
2. `design-reviewer` - Review filter UI for design compliance and usability

## Final Verification

Run lint, build, and tests:

1. `pnpm lint` - Fix any linting errors
2. `pnpm build` - Ensure production build succeeds
3. `pnpm test` - Ensure all tests pass

## Execution

After approval:

1. Spawn implementer for Task 1, run pipeline
2. Spawn implementer for Task 2, run pipeline
3. Run review subagents: code-simplifier and design-reviewer on all modified files
4. Run lint, build, and test to verify everything works
```

---

## After Approval

Once the user approves via `ExitPlanMode`:

### Phase 1: Implementation

1. Read the task list from the plan file
2. For each task:
   - Spawn the assigned agent via `Task` tool
   - Run the pipeline (implementer → tester [→ seo-reviewer if page])
   - Report results before moving to next task

### Phase 2: Post-Implementation Review

After all tasks complete:

1. Run review subagents: `code-simplifier` and `design-reviewer` on all modified files
2. Apply suggested changes from review subagents

### Phase 3: Final Verification

Run lint, build, and tests to ensure everything works:

1. `pnpm lint` - Fix any linting errors
2. `pnpm build` - Ensure production build succeeds
3. `pnpm test` (if applicable) - Ensure all tests pass
4. Summarize what was built

**Execution pattern:**

```
Task 1: implementer agent
  ↓ completed
Task 1: tester agent
  ↓ completed
→ Report Task 1 results

Task 2: implementer agent
  ↓ completed
Task 2: tester agent
  ↓ completed
→ Report Task 2 results

...continue until all tasks done

Post-Implementation Review:
  code-simplifier agent (all modified code)
    ↓ completed
  design-reviewer agent (all UI components)
    ↓ completed

Final Verification:
  pnpm lint (fix errors)
    ↓ completed
  pnpm build (ensure success)
    ↓ completed
  pnpm test (if applicable)
    ↓ completed
→ Summarize what was built
```
