---
description: Clean up worktree, branch, and workspace entry
---

# Worktree Cleanup

## Overview

Clean up a git worktree, its branch, and VS Code workspace entry.

**Arguments:** Optional worktree name from `$ARGUMENTS`

## Phase 1: Detect Worktrees

List worktrees using git. The main repo is the first entry - exclude it.

- If no worktrees exist → inform user and stop
- If `$ARGUMENTS` provided but not found → show available worktrees and stop
- If `$ARGUMENTS` empty → use `AskUserQuestion` to let user select (header: "Worktree")

## Phase 2: Gather Info

For the selected worktree, determine:

- Worktree path and name
- Branch name
- Base branch (current branch in main repo)
- Whether uncommitted changes exist

## Phase 3: Action Selection

Use `AskUserQuestion` (header: "Action") with options:

1. **Commit, merge, and clean up** - Save work to base branch, then remove everything
2. **Discard and clean up** - Delete everything without saving
3. **Cancel** - Do nothing

If cancel → inform user and stop.

## Phase 4: Commit and Merge (if selected)

Only if user chose "Commit, merge, and clean up":

1. Stage and commit all changes in the worktree
2. Merge the branch into base branch in main repo
3. If merge conflicts → show resolution instructions and stop

## Phase 5: Execute Cleanup

1. Remove worktree entry from `../jobstash.code-workspace` using **Edit tool**
2. Remove git worktree (force)
3. Delete git branch
4. Remove directory if still exists

## Phase 6: Completion

Display summary of what was merged (if applicable) and removed.

## Error Handling

| Scenario               | Action                     |
| ---------------------- | -------------------------- |
| No worktrees found     | Inform and stop            |
| Worktree not found     | List available and stop    |
| User cancels           | Inform and stop            |
| Merge conflicts        | Show instructions and stop |
| Workspace file missing | Skip, continue             |
| Branch deletion fails  | Warn, continue             |

## Notes

- Use `git -C <path>` instead of `cd` to avoid shell alias issues
- Use Edit tool for JSON modifications (avoid jq)
