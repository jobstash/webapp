---
name: finalize
description: Finalize a feature implementation - analyze changes, create atomic commits, and clean up the worktree.
---

# Finalize Feature

Complete a feature implementation by creating commits and cleaning up.

## Usage

```
/finalize
```

No arguments needed — the command detects the current worktree automatically.

## Prerequisites

- Must be run from within a worktree (sibling folder `<project>-<feature>/`)
- Worktree must have been created with `/implement`

## Execution Flow

### Step 1: Detect Worktree

Check if we're in a worktree by looking for `.claude-worktree.json`:

```bash
cat .claude-worktree.json
```

**If file not found:** Report error — not in a worktree.

**If found:** Extract metadata:

- `feature`: The feature name
- `baseBranch`: The branch to compare against
- `projectRoot`: Path to return to

### Step 2: Analyze Changes (Dry Run)

Run the finalize script in analysis mode. Use `--path` to avoid `cd` issues with shell hooks (e.g., zoxide):

```bash
npx tsx .claude/scripts/worktree/finalize.ts --path=../<project>-<feature>
```

**Alternative** (if running from within worktree works):

```bash
npx tsx .claude/scripts/worktree/finalize.ts
```

This outputs:

- `changes`: List of all changed files with categories
- `commitGroups`: Proposed commit groupings

### Step 2.5: Validate & Fix

Before showing the commit plan, ensure code quality passes all checks.

**Run validation commands in sequence:**

```bash
pnpm format
pnpm lint
pnpm build
```

**For each command:**

1. Run the command
2. If it succeeds, continue to next command
3. If it fails:
   - Read the error output carefully
   - Identify the file(s) and issue(s)
   - Fix the code
   - Re-run the failed command
   - Repeat until it passes
4. Once all three pass, proceed to Step 3

**Example flow:**

```
Running validation...

$ pnpm format
✓ Format complete

$ pnpm lint
Error: src/features/dashboard/components/card.tsx
  12:5  error  'unused' is defined but never used

Fixing lint error in card.tsx...
[Edit file to remove unused variable]

$ pnpm lint
✓ Lint passed

$ pnpm build
✓ Build successful

All validation passed. Proceeding to commit plan...
```

**Important:**

- Fix errors in the worktree code, not the validation commands
- After fixing, always re-run the specific command that failed
- Do not proceed to Step 3 until all three commands pass
- If a fix introduces new errors, address those too

**Show the user the commit plan:**

```
Analyzing changes...

Found N changed files:

Proposed commits:
  1. chore: migrate to src folder structure
     - tsconfig.json
     - src/app/layout.tsx, page.tsx, globals.css

  2. chore: add dependencies
     - package.json
     - pnpm-lock.yaml

  3. chore: add utility functions
     - src/lib/utils.ts

  4. feat: add schemas
     - src/features/dashboard/schemas.ts

  5. feat: add API endpoint
     - src/app/api/dashboard/metrics/route.ts

  6. feat: add server-side data fetcher
     - src/features/dashboard/server/**

  7. feat: add metric-card component
     - src/features/dashboard/components/metric-card/**

  8. feat: add metrics-grid component
     - src/features/dashboard/components/metrics-grid/**

  9. feat: add dashboard-metrics component
     - src/features/dashboard/components/dashboard-metrics/**

  10. feat: add page
      - src/app/dashboard/page.tsx

Proceed with commits? (y/n)
```

### Step 3: Confirm with User

Ask the user to confirm before creating commits.

**If user declines:** Stop, leave everything as is.

**If user confirms:** Proceed to Step 4.

### Step 4: Create Commits

Run the finalize script with commit flag:

```bash
npx tsx .claude/scripts/worktree/finalize.ts --path=../<project>-<feature> --commit
```

Report each commit as it's created:

```
Creating commits...
  ✓ chore: migrate to src folder structure
  ✓ chore: add dependencies
  ✓ chore: add utility functions
  ✓ feat: add schemas
  ✓ feat: add API endpoint
  ✓ feat: add server-side data fetcher
  ✓ feat: add metric-card component
  ✓ feat: add metrics-grid component
  ✓ feat: add dashboard-metrics component
  ✓ feat: add page

10 commits created on branch feature/dashboard
```

### Step 5: Ask About Cleanup

Ask the user if they want to clean up the worktree:

```
Clean up worktree and return to main project? (y/n)
```

**If user declines:**

- Stay in worktree
- Report: "Commits created. Worktree preserved at ../<project>-<feature>"

**If user confirms:** Proceed to Step 6.

### Step 6: Clean Up and Return

**6a. Get the project root path from metadata:**

```bash
cat .claude-worktree.json | grep projectRoot
```

**6b. Change to project root:**

```bash
cd <projectRoot>
```

**6c. Update VS Code workspace file:**

Remove the worktree entry from `../<project>.code-workspace` so it no longer appears in the IDE:

```bash
npx tsx .claude/scripts/worktree/finalize.ts --path=../<project>-<feature> --cleanup
```

Or manually edit the workspace file to remove the folder entry.

**6d. Remove the worktree:**

```bash
git worktree remove ../<project>-<feature> --force
```

Note: `--force` is needed because `.claude-worktree.json` is an untracked metadata file.

**6d. Optionally clean up orchestration state:**

Ask user:

```
Delete plan and state files? (y/n)
- .claude/plans/<feature>.plan.md
- .claude/state/<feature>.state.json
```

If yes:

```bash
npx tsx .claude/scripts/orchestrate/cleanup.ts <feature> --force
```

### Step 7: Report Completion

```
✓ Finalization complete

Branch: feature/<feature>
Base: <baseBranch>
Commits: N

The branch is ready for pull request.

To create PR:
  git push -u origin feature/<feature>
  gh pr create  # or use your preferred method
```

---

## Commit Grouping Logic

Changes are grouped by **logical unit** with atomic granularity. The goal is meaningful, cohesive commits that represent complete units of work.

### Commit Message Convention

Use commitlint format **without scopes** since the feature branch provides context:

```
feat: add schemas          # Good - branch is feature/dashboard
feat(dashboard): add schemas  # Avoid - redundant scope
```

### Grouping Principles

1. **Atomic commits**: Each component directory, utility, or logical unit gets its own commit.

2. **Dependency order**: Commits are ordered so earlier commits don't depend on later ones:
   - Infrastructure (tsconfig, package.json) first
   - Utilities (cn, helpers) before components that use them
   - Schemas/types (no dependencies)
   - API endpoints (depend on schemas)
   - Server data layer (depends on API)
   - Leaf components first (MetricCard before MetricsGrid)
   - Container components (depend on leaf components)
   - Pages last (depend on everything)

3. **No broad grouping**: Avoid grouping all components together. Each component directory is atomic.

### Example Groupings

| Commit                                   | Description                 | Files                                  |
| ---------------------------------------- | --------------------------- | -------------------------------------- |
| `chore: migrate to src folder structure` | Infrastructure changes      | `tsconfig.json`, `src/app/` base files |
| `chore: add dependencies`                | Package updates             | `package.json`, `pnpm-lock.yaml`       |
| `chore: add utility functions`           | Shared utilities            | `src/lib/utils.ts`                     |
| `feat: add schemas`                      | Zod schemas and types       | `schemas.ts`                           |
| `feat: add API endpoint`                 | API route                   | `app/api/**/route.ts`                  |
| `feat: add server-side data fetcher`     | Server data layer           | `server/**/*.ts`                       |
| `feat: add metric-card component`        | Single component + skeleton | `components/metric-card/**`            |
| `feat: add metrics-grid component`       | Single component + skeleton | `components/metrics-grid/**`           |
| `feat: add dashboard-metrics component`  | Container component         | `components/dashboard-metrics/**`      |
| `feat: add page`                         | Page route                  | `app/**/page.tsx`                      |

### Anti-patterns to Avoid

- **Broad categories**: "add components" groups unrelated code
- **File-type grouping**: Splits logical units across commits
- **Giant single commit**: Too coarse, hard to review or revert
- **Redundant scopes**: `feat(dashboard):` when branch is `feature/dashboard`

The ideal is 8-12 atomic commits for a typical feature, each representing a single logical unit.

---

## Error Handling

**Not in worktree:**

```
Error: Not in a worktree.
Run /finalize from within the worktree directory.
```

**No changes:**

```
No changes to commit.
The worktree has no modifications compared to <baseBranch>.
```

**Uncommitted changes in project root:**

```
Warning: Cannot remove worktree - has uncommitted changes.
Please commit or stash changes first.
```

---

## Example Session

```
> /finalize

Detecting worktree...
✓ Feature: dashboard
✓ Base branch: main

Analyzing changes...

Found 15 changed files:

Proposed commits:
  1. chore: migrate to src folder structure
  2. chore: add dependencies
  3. chore: add utility functions
  4. feat: add schemas
  5. feat: add API endpoint
  6. feat: add server-side data fetcher
  7. feat: add metric-card component
  8. feat: add metrics-grid component
  9. feat: add dashboard-metrics component
  10. feat: add page

Proceed with commits? (y/n) y

Creating commits...
  ✓ chore: migrate to src folder structure
  ✓ chore: add dependencies
  ✓ chore: add utility functions
  ✓ feat: add schemas
  ✓ feat: add API endpoint
  ✓ feat: add server-side data fetcher
  ✓ feat: add metric-card component
  ✓ feat: add metrics-grid component
  ✓ feat: add dashboard-metrics component
  ✓ feat: add page

10 commits created on branch feature/dashboard

Clean up worktree? (y/n) y

Returning to project root...
Removing worktree...
✓ Worktree removed

Delete plan and state files? (y/n) n

✓ Finalization complete

Branch: feature/dashboard
Base: main
Commits: 10

To create PR:
  git push -u origin feature/dashboard

~/project (main) $ _
```
