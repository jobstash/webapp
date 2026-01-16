---
name: worktree-session
description: Auto-detected skill for worktree development sessions. Use when starting Claude in a git worktree created by worktree-dev.sh. Triggers brainstorm workflow with stored feature description.
---

# Worktree Session

This skill activates when Claude starts in a git worktree created by `./scripts/worktree-dev.sh`.

## Detection

At session start, check if `.worktree-session.json` exists in the current directory.

## Workflow

### Step 1: Read Session File

Read `.worktree-session.json` from current directory:

```json
{
  "branch": "feat/salary-filter",
  "description": "Add salary range filter with min/max slider",
  "mainRepo": "/Users/johnshift/code/jobstash/webapp",
  "createdAt": "2026-01-16T10:30:00Z"
}
```

### Step 2: Display Session Context

Show the user what session they're in:

```
================================================================================
WORKTREE SESSION DETECTED
================================================================================

Branch:  <branch>
Feature: <description>
Main:    <mainRepo>

================================================================================
```

### Step 3: Trigger Brainstorm

Invoke the `brainstorm` skill with the feature description from the session file.

Pass the description as the feature to implement. The brainstorm workflow will:

1. Enter plan mode
2. Explore codebase and ask clarifying questions
3. Create task list with agent assignments
4. Get user approval
5. Execute implementation (implementer -> tester -> reviews)
6. Run final verification (lint, build, test)

### Step 4: Post-Implementation Reminder

After brainstorm completes, remind the user:

```
================================================================================
IMPLEMENTATION COMPLETE
================================================================================

Your feature has been implemented in branch: <branch>

To finalize this session, run:

  /worktree:finish

This will:
- Rebase your changes on main (fast-forward ready)
- Prepare for cleanup

After /worktree:finish, exit Claude (Ctrl+C or /exit) to let the
script complete cleanup and return to the main repo.

================================================================================
```

## Important

- This skill auto-activates when `.worktree-session.json` is detected
- The session file is created by `./scripts/worktree-dev.sh`
- After implementation, use `/worktree:finish` then exit Claude
- The shell script handles worktree cleanup after Claude exits
