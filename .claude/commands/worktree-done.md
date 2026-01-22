---
name: worktree-done
description: Finalize ad-hoc worktree work - validate, commit, and cleanup
---

# Worktree Done

Complete ad-hoc worktree work by validating, committing, and cleaning up.

## Usage

```
/worktree-done
```

No arguments needed — detects worktree from current directory.

## Prerequisites

- Must be run from within a worktree session
- Worktree must have `.claude-worktree.json` file

## Execution

### Step 1: Validate Context

Check if `.claude-worktree.json` exists in current directory.

If not found:

```
Error: Not in a worktree.
Start Claude from the worktree directory first.
```

### Step 2: Run Validation

Fix any issues before committing:

```bash
pnpm format && pnpm lint && pnpm build
```

If validation fails, fix issues and retry.

### Step 3: Analyze Changes

```bash
npx tsx .claude/scripts/worktree/analyze.ts --path=<cwd>
```

Parse JSON output. If no changes, report and skip to cleanup.

### Step 4: Create Commits

```bash
npx tsx .claude/scripts/worktree/commit.ts --path=<cwd>
```

Report each commit created.

### Step 5: Cleanup

```bash
npx tsx .claude/scripts/worktree/cleanup.ts --path=<cwd>
```

### Step 6: Report Completion

```
✓ Worktree cleaned up
Branch: feature/<name> (<N> commits)

To return to main project:
  cd <projectRoot> && claude

To create PR:
  git push -u origin feature/<name>
  gh pr create
```

## Example

```
> /worktree-done

Running validation...
✓ All checks passed

Analyzing changes...
Found 5 files changed

Creating commits...
✓ feat: add schemas
✓ feat: add user-card component
✓ feat: add page

Cleaning up...
✓ Worktree removed

Branch: feature/quick-fix (3 commits)

To return to main project:
  cd /Users/john/code/webapp && claude

To create PR:
  git push -u origin feature/quick-fix
  gh pr create
```
