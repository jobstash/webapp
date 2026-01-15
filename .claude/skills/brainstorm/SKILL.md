---
name: brainstorm
description: Interactive requirements gathering. Turn vague ideas into clear, actionable tasks with agent assignments. Use when discussing, clarifying, or planning a feature before implementation.
---

# Brainstorm

## Purpose

Transform a vague idea into a clear task list with agent assignments, ready for sequential execution.

## Input

A vague idea or feature request (e.g., "we need better search" or "add salary filters").

## Output

A task list where each task has:

- Clear description
- Agent assignment (implementer, tester, design-reviewer, etc.)
- Dependencies (if any)

---

## Process

### Phase 1: Understand

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

### Phase 2: Challenge

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

### Phase 3: Define Tasks

**Goal:** Break down into executable tasks with agent assignments.

For each task, determine:

1. **What** to build
2. **Which agent** should handle it
3. **What follows** (sequential pipeline)

**Agent Selection Guide:**

| Work Type                 | Agent             | Followed By             |
| ------------------------- | ----------------- | ----------------------- |
| Build component/hook/util | `implementer`     | `simplifier` → `tester` |
| Write tests               | `tester`          | `simplifier`            |
| Review UI/UX              | `design-reviewer` | -                       |
| Review code quality       | `code-reviewer`   | -                       |
| Review SEO (pages only)   | `seo-reviewer`    | -                       |

**Standard Pipeline for Implementation:**

```
implementer → simplifier → tester → simplifier → [reviewer]
```

### Phase 4: Present & Confirm

Present the task list in this format:

```markdown
## Tasks

### Task 1: [Title]

**Description:** [What to build - one sentence]
**Agent:** implementer
**Pipeline:** implementer → simplifier → tester → simplifier

### Task 2: [Title]

**Description:** [What to build - one sentence]
**Agent:** tester
**Pipeline:** tester → simplifier

### Task 3: [Title]

**Description:** [What to review]
**Agent:** design-reviewer
```

Ask: "Does this task breakdown work? Ready to execute?"

---

## Task Requirements

Each task must be:

- **Clear** - One sentence describing what to build/do
- **Assigned** - Has a designated agent
- **Sequenced** - Pipeline is defined

---

## Example Output

```markdown
## Feature: Salary Range Filter

### Task 1: Create SalaryRangeFilter component

**Description:** Build a dual-handle slider component for filtering jobs by salary range, with min/max inputs.
**Agent:** implementer
**Pipeline:** implementer → simplifier → tester → simplifier → design-reviewer

### Task 2: Add salary filter to filters sidebar

**Description:** Integrate SalaryRangeFilter into the existing filters-aside component.
**Agent:** implementer
**Pipeline:** implementer → simplifier → tester → simplifier

### Task 3: Review filter UX

**Description:** Review the salary filter for design system compliance and usability.
**Agent:** design-reviewer
```

---

## After Confirmation

Once user confirms, the main session will:

1. Execute tasks sequentially
2. Spawn appropriate agents for each task
3. Run the pipeline (with post-hooks)
4. Report results with skills applied

**Note:** You (brainstorm) only define tasks. Execution happens in the main session.
