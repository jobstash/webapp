---
name: planning
description: Plan JobStash features by breaking them into structured tasks with agent assignments. Use when planning new features or complex changes.
---

# JobStash Feature Planning

Break features into discrete tasks with agent assignments for execution via `/worktree:start`.

## Task Structure

Each task needs:

| Field           | Description                  |
| --------------- | ---------------------------- |
| **Description** | One sentence - what to build |
| **Agent**       | Who executes it              |
| **Pipeline**    | Sequential agents            |

## Agent Assignments

| Work Type                | Agent         | Pipeline                                |
| ------------------------ | ------------- | --------------------------------------- |
| Component, hook, utility | `implementer` | `implementer -> tester`                 |
| Page                     | `implementer` | `implementer -> tester -> seo-reviewer` |
| Tests only               | `tester`      | `tester`                                |

**Post-implementation:** Run `code-simplifier` then `design-reviewer` on all modified code.

## Plan File Format

Write to: `docs/plan/PLAN-{branch}.local.md`

Branch naming: Feature name → branch (e.g., "Add salary filter" → `feat/salary-filter`)

```markdown
# Feature: [Name]

## Summary

[One paragraph - what we're building and key decisions]

## Tasks

### Task 1: [Title]

**Description:** [One sentence]
**Agent:** implementer
**Pipeline:** implementer -> tester

### Task 2: [Title]

**Description:** [One sentence]
**Agent:** implementer
**Pipeline:** implementer -> tester -> seo-reviewer

## Post-Implementation Review

1. `code-simplifier` - Refine all modified code
2. `design-reviewer` - Review UI components

## Final Verification

1. `pnpm lint`
2. `pnpm build`
3. `pnpm test`
```

## After Planning

Do not implement. Display:

```
Plan: docs/plan/PLAN-{branch}.local.md
Execute: /worktree:start {branch} docs/plan/PLAN-{branch}.local.md
```
