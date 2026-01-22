---
name: finalize
description: Finalize a feature implementation - validate, create atomic commits, and clean up the worktree.
---

# Finalize Feature

Complete a feature implementation by validating, committing, and cleaning up.

## Usage

```
/finalize
```

No arguments needed — detects worktree from current directory.

## Context Requirement

This command must be run from a worktree session.

If `.claude-worktree.json` does not exist:

```
Error: Not in a worktree.
Start Claude from the worktree directory:
  cd <worktreePath> && claude
```

## Execution

### Step 1: Validate Context

Check if `.claude-worktree.json` exists in current directory.
Read metadata to get `projectRoot` and `feature`.

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

---

## Commit Grouping Logic

Changes are grouped by **logical unit** with atomic granularity.

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
   - Utilities (cn, helpers) before components
   - Schemas/types (no dependencies)
   - API endpoints (depend on schemas)
   - Server data layer (depends on API)
   - Leaf components first
   - Container components (depend on leaf components)
   - Pages last (depend on everything)

3. **No broad grouping**: Each component directory is atomic.

---

## Error Handling

**No changes:**

```
No changes to commit.
The worktree has no modifications compared to <baseBranch>.
```

---

## Example Session

```
> /finalize

Running validation...
✓ All checks passed

Analyzing changes...
Found 10 files changed

Creating commits...
✓ chore: add utility functions
✓ feat: add schemas
✓ feat: add API endpoint
✓ feat: add metric-card component
✓ feat: add page

Cleaning up...
✓ Worktree removed

Branch: feature/dashboard (5 commits)

To return to main project:
  cd /Users/john/code/webapp && claude

To create PR:
  git push -u origin feature/dashboard
  gh pr create
```
