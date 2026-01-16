---
description: Complete worktree session - rebase, cleanup worktree, and prepare branch for merge
allowed-tools:
  - Bash(git:*)
  - Read
---

# Worktree Finish

Finalize a worktree development session by rebasing on main.

## Prerequisites

- Must be running in a worktree directory (has `.worktree-session.json`)
- All changes must be committed

## Steps

### 1. Validate Worktree Session

Check for `.worktree-session.json` in current directory:

```bash
test -f .worktree-session.json && echo "exists"
```

If not found, display error:

```
ERROR: This doesn't appear to be a worktree session.

Run this command from a worktree created by ./scripts/worktree-dev.sh
Current directory: <pwd>
```

### 2. Read Session Info

Read `.worktree-session.json` and display:

```
================================================================================
WORKTREE SESSION
================================================================================
Branch: <branch>
Base:   <baseBranch>
Description: <description>
Main Repo: <mainRepo>
================================================================================
```

Note: Use `baseBranch` from the session file for rebasing (not always `main`).

### 3. Check Working Tree Status

```bash
git status --porcelain
```

If there are uncommitted changes, warn:

```
WARNING: Uncommitted changes detected.

Modified files:
<list files>

Please commit or stash before finishing:
  git add -A && git commit -m "your message"

Then run /worktree:finish again.
```

Stop here if uncommitted changes exist.

### 4. Rebase on Base Branch

Fetch and rebase on the base branch from the session file:

```bash
git fetch origin <baseBranch>
git rebase origin/<baseBranch>
```

If conflicts occur:

```
CONFLICT: Rebase has conflicts.

Please resolve conflicts:
1. Edit conflicting files
2. git add <resolved-files>
3. git rebase --continue
4. Run /worktree:finish again

Or abort:
  git rebase --abort
```

Stop here if conflicts exist.

### 5. Display Completion Message

```
================================================================================
REBASE COMPLETE
================================================================================

Branch '<branch>' is ready and fast-forward mergeable to <baseBranch>.

NOW: Exit Claude (Ctrl+C or /exit) to let the worktree-dev.sh script
complete the cleanup and return you to the main repo.

The script will:
- Remove this worktree
- Return to main repo
- Show you the merge command

================================================================================
```

## Important

- The shell script handles worktree cleanup after Claude exits
- Exit Claude to continue the workflow
- Fast-forward merge preserves clean linear history
