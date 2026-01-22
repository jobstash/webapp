---
description: Generate an implementation plan from a feature request. Decomposes into tasks with dependencies, routes to specialized subagents.
allowed-tools: Read, Write, Glob, Grep, Bash(npx tsx:*)
hint-args: '<feature description>'
---

# Implementation Planner

Generate a `.plan.md` file from a feature description. Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

## Usage

```
/create-plan "<feature description>"
```

## Output

`.claude/plans/<feature-slug>.plan.md`

## Process

### Phase 1: Understand

1. **Context** — Check project state (existing patterns, relevant files)
2. **Clarify** — Ask questions one at a time to refine requirements
3. **Explore** — Propose 2-3 approaches with trade-offs
4. **Confirm** — Present understanding in sections; validate each

### Phase 2: Plan

5. **Decompose** — Break into single-concern tasks
6. **Route** — Assign agent types
7. **Order** — Define dependencies
8. **Validate** — Check for cycles, missing deps
9. **Write** — Output the plan file

## Requirement Gathering

Before decomposing, refine the feature request through dialogue.

### Step 1: Context

Check project state first:

- Scan relevant files and existing patterns
- Look at recent commits if helpful
- Understand what already exists

### Step 2: Clarify

Ask questions one at a time to refine the idea:

- **One question per message** — If a topic needs more exploration, break into multiple questions
- **Multiple choice preferred** — Easier to answer than open-ended when possible
- **Focus areas**: Purpose, scope, constraints, success criteria

Example questions:

- "Should this feature [A] or [B]?" (multiple choice)
- "What should happen when [edge case]?" (specific, not vague)
- "Does this need to integrate with [existing feature]?"

### Step 3: Explore Approaches

Once requirements are clear, propose 2-3 implementation approaches:

- **Lead with recommendation** — State your preferred approach first with reasoning
- **Show trade-offs** — What each approach gains/loses
- **Be specific** — Not "we could do X or Y" but "I recommend X because..."

Example:

> I recommend **Approach A** (server components with streaming) because it matches your existing patterns and avoids client-side state.
>
> Alternatives:
>
> - **Approach B** (client-side with React Query): More interactive but adds bundle size
> - **Approach C** (hybrid): Flexible but more complex

### Step 4: Confirm Understanding

Present your understanding in small sections (200-300 words each):

1. **What we're building** — Core functionality
2. **How it fits** — Integration with existing code
3. **Key decisions** — Architecture choices made

After each section, ask: "Does this look right so far?"

Only proceed to Phase 2 (decomposition) once user confirms.

## Agent Types

Each task is executed by a specialized subagent:

| Agent             | Description                                                 | Creates                           | Skills Used         |
| ----------------- | ----------------------------------------------------------- | --------------------------------- | ------------------- |
| `react-architect` | All React code: components, hooks, boundaries, pages, tests | `*.tsx`, `use-*.ts`, `*.test.tsx` | All react-\* skills |
| `manual`          | Needs human action (config, env, external services)         | (varies)                          | —                   |

### Agent Selection Guide

| Task Type                                 | Agent             |
| ----------------------------------------- | ----------------- |
| Component (with hook, boundary, skeleton) | `react-architect` |
| Custom hook                               | `react-architect` |
| Page/layout composition                   | `react-architect` |
| React Query data fetching                 | `react-architect` |
| Tests for React code                      | `react-architect` |
| Types/schemas for React features          | `react-architect` |
| API routes (server code)                  | `react-architect` |
| Config, env vars, external setup          | `manual`          |
| Database migrations                       | `manual`          |
| Third-party service setup                 | `manual`          |

## Task Granularity

Each task = one subagent = one concern.

**Split when:** Task would touch different concerns.

**Examples:**

- "UserCard component with data fetching" → 1 task (`react-architect` handles all)
- "User types + API + component" → 3 tasks (types → api → component)

## Dependency Rules

```
manual (setup) ────┐
                   │
types/schemas ─────┤
       │           │
       ├─ api ─────┤
       │           │
       └─ hooks ───┤
            │      │
      components ──┤
            │      │
          page ────┘
```

Use **minimal** dependencies. Only add if task truly needs output from another.

## Plan Format

```markdown
---
feature: <slug>
created: <ISO timestamp>
status: draft
---

# Implementation Plan: <Title>

## Overview

<Brief description of the feature>

## Tasks

### <task-id>

- **title**: <Human readable title>
- **agent**: <agent-type from table above>
- **depends_on**: [<task-ids>]
- **inputs**:
  - files: [<paths to read>]
  - context: <additional context or null>
- **outputs**:
  - files: [<paths to create/modify>]
  - exports: [<exported symbols>]
- **prompt**: |
  <Clear instructions for the subagent>

  Include:
  - What to create
  - Key requirements
  - Constraints
  - Expected behavior

---

### <next-task>

...
```

## Example Plan

```markdown
---
feature: user-profile
created: 2024-01-21T08:00:00Z
status: draft
---

# Implementation Plan: User Profile Feature

## Overview

Add user profile page with editable fields and avatar upload.

## Tasks

### user-types

- **title**: Define User types and schemas
- **agent**: react-architect
- **depends_on**: []
- **inputs**:
  - files: []
  - context: null
- **outputs**:
  - files: [src/features/user/schemas.ts]
  - exports: [User, UserProfile, userSchema]
- **prompt**: |
  Create Zod schemas and TypeScript types for User and UserProfile.
  Include: id, email, name, avatarUrl, bio, createdAt.
  Follow code-essentials patterns.

---

### user-api

- **title**: Create user API endpoints
- **agent**: react-architect
- **depends_on**: [user-types]
- **inputs**:
  - files: [src/features/user/schemas.ts]
  - context: null
- **outputs**:
  - files: [src/app/api/user/[id]/route.ts]
  - exports: [GET, PATCH]
- **prompt**: |
  Create GET and PATCH endpoints for user profile.
  Use schemas from user-types task.
  Validate input with Zod.
  Follow server-only patterns.

---

### user-profile-component

- **title**: Create UserProfile component with edit form
- **agent**: react-architect
- **depends_on**: [user-types, user-api]
- **inputs**:
  - files: [src/features/user/schemas.ts]
  - context: Needs loading states, error boundary, form handling
- **outputs**:
  - files: [src/features/user/components/user-profile/]
  - exports: [UserProfile]
- **prompt**: |
  Create UserProfile component with:
  - Editable form fields (name, bio)
  - Avatar display and upload
  - Loading skeleton
  - Error boundary
  - Custom hook for logic

  Follow react-essentials patterns.

---

### setup-storage

- **title**: Configure cloud storage for avatars
- **agent**: manual
- **depends_on**: []
- **inputs**:
  - files: []
  - context: Need S3 or similar for avatar uploads
- **outputs**:
  - files: [.env.local]
  - exports: []
- **prompt**: |
  Human action required:
  1. Create S3 bucket or configure cloud storage
  2. Add environment variables to .env.local
  3. Mark task complete when done
```

## Validation

After writing the plan, create the plans directory if needed:

```bash
mkdir -p .claude/plans
```

If a validation script exists, run:

```bash
npx tsx .claude/scripts/validate-plan.ts .claude/plans/<feature>.plan.md
```

Fix any errors before finishing.

## Post-Plan Actions

After writing the plan, use AskUserQuestion to prompt:

**Question**: "Would you like to create a worktree for this feature?"

**Options**:

1. **Yes, create worktree** - Creates isolated workspace for implementation
2. **No, just the plan** - Create worktree later manually

### If "Yes, create worktree":

1. Run setup script:

   ```bash
   npx tsx .claude/scripts/worktree/setup.ts <feature-slug>
   ```

2. Report with terminal instructions:

   ```
   ✓ Plan created: .claude/plans/<feature>.plan.md
   ✓ Worktree ready: <worktreePath>
   ✓ Branch: feature/<feature>

   To start implementation, run in your terminal:
     cd <worktreePath> && claude

   Then run `/implement-plan` in that session.
   ```

### If "No, just the plan":

```
✓ Plan created: .claude/plans/<feature>.plan.md

To implement later:
  /worktree-init <feature>
  # Then in new session: /implement-plan
```

## Notes

- Plans are **draft** until user approves
- Each task prompt should be self-contained (subagent has no prior context)
