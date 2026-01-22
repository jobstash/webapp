---
name: worktree
aliases: [wt]
description: Lightweight worktree workflow - create isolated worktree without a plan
---

# Worktree Skill

Lightweight worktree management without requiring a formal plan.

## Usage

- `/wt init <name>` - Create and switch to a worktree
- `/wt done` - Finalize (commits + cleanup) and return to main project

---

## init \<name\>

Create an isolated worktree for quick work.

### Execution

1. Run setup script with --no-plan flag:

   ```bash
   npx tsx .claude/scripts/worktree/setup.ts <name> --no-plan
   ```

2. Parse JSON output for `worktreePath` and `success`

3. If success, instruct user:
   - They are now in the worktree at `<worktreePath>`
   - When done, run `/wt done` to finalize

### Error Handling

- No name provided: "Usage: /wt init \<name\>"
- Worktree already exists: Resume message (refreshes .env only)

---

## done

Finalize work and return to main project.

### Execution

This reuses the `/finalize` skill logic with one difference:

1. Check for `.claude-worktree.json` in current directory
2. Run validation (format, lint, build) and fix any issues
3. Run finalize analysis to get commit groups
4. Show commit plan and ask for confirmation
5. Create commits if confirmed
6. Ask about cleanup (remove worktree)
7. Return to project root

### Differences from /finalize

- Skip "Delete plan and state files?" prompt (there's no plan since `metadata.plan` is empty)
- Otherwise identical behavior

Follow the exact steps documented in `/finalize` but skip the plan cleanup prompt when `metadata.plan` is empty.

---

## Example Session

```
> /wt init quick-fix

Creating worktree...
Installing dependencies...

Worktree created at ../webapp-quick-fix
You are now in the worktree.

When done, run /wt done to finalize.

~/webapp-quick-fix (feature/quick-fix) $ _
```

```
> /wt done

Detecting worktree...
Feature: quick-fix
Base branch: main

Running validation...
$ pnpm format
$ pnpm lint
$ pnpm build
All validation passed.

Analyzing changes...

Found 3 changed files:

Proposed commits:
  1. fix: update error handling
     - src/lib/utils.ts

  2. fix: correct validation logic
     - src/features/auth/schemas.ts

Proceed with commits? (y/n) y

Creating commits...
  ✓ fix: update error handling
  ✓ fix: correct validation logic

2 commits created on branch feature/quick-fix

Clean up worktree? (y/n) y

Returning to project root...
Removing worktree...
✓ Worktree removed

✓ Finalization complete

Branch: feature/quick-fix
Base: main
Commits: 2

To create PR:
  git push -u origin feature/quick-fix
  gh pr create

~/webapp (main) $ _
```
