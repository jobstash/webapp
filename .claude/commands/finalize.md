---
name: finalize
description: Finalize a feature implementation - analyze changes, create atomic commits, and clean up the worktree.
---

# Finalize Feature

Complete a feature implementation by creating commits and cleaning up. Fully automated.

## Usage

```
/finalize
```

No arguments needed — the command detects the current worktree automatically.

## Prerequisites

- Must be run from within a worktree (sibling folder `<project>-<feature>/`)
- Worktree must have been created with `/implement` or `/worktree init`

## Execution

1. Read `.claude-worktree.json` for metadata (feature, baseBranch, projectRoot)

2. Run validation and fix any issues until all pass:

   ```bash
   pnpm format && pnpm lint && pnpm build
   ```

3. Create commits and cleanup in one command:

   ```bash
   npx tsx .claude/scripts/worktree/finalize.ts --path=../<project>-<feature> --commit --cleanup
   ```

4. If `cleanedUp: false` in output, run manual fallback:

   ```bash
   cd <projectRoot> && git worktree remove ../<project>-<feature> --force
   ```

5. Report completion with branch name and PR instructions

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

| Commit                                   | Files                                  |
| ---------------------------------------- | -------------------------------------- |
| `chore: migrate to src folder structure` | `tsconfig.json`, `src/app/` base files |
| `chore: add dependencies`                | `package.json`, `pnpm-lock.yaml`       |
| `chore: add utility functions`           | `src/lib/utils.ts`                     |
| `feat: add schemas`                      | `schemas.ts`                           |
| `feat: add API endpoint`                 | `app/api/**/route.ts`                  |
| `feat: add server-side data fetcher`     | `server/**/*.ts`                       |
| `feat: add metric-card component`        | `components/metric-card/**`            |
| `feat: add metrics-grid component`       | `components/metrics-grid/**`           |
| `feat: add dashboard-metrics component`  | `components/dashboard-metrics/**`      |
| `feat: add page`                         | `app/**/page.tsx`                      |

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

---

## Example Session

```
> /finalize

Running validation...
✓ All checks passed

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

Cleaning up...
✓ Worktree removed

Branch: feature/dashboard (10 commits)

To create PR:
  git push -u origin feature/dashboard
  gh pr create

~/project (main) $ _
```
