---
name: worktree
description: Lightweight worktree workflow - create isolated worktree without a plan
---

# Worktree Skill

Lightweight worktree management without requiring a formal plan.

## Usage

- `/worktree init <name>` - Create and switch to a worktree
- `/worktree done` - Finalize and return to main project (fully automated)

---

## init \<name\>

Create an isolated worktree for quick work.

### Execution

1. Run setup script:

   ```bash
   npx tsx .claude/scripts/worktree/setup.ts <name> --no-plan
   ```

2. Parse JSON output for `worktreePath` and `success`

3. Change to the worktree:

   ```bash
   cd <worktreePath>
   ```

4. Report success: "Worktree ready at `<worktreePath>`. Run `/worktree done` when finished."

### Error Handling

- No name provided: "Usage: /worktree init \<name\>"
- Worktree already exists: Resume message

---

## done

Finalize work and return to main project. Fully automated - no prompts.

### Execution

1. Read `.claude-worktree.json` for metadata (feature, baseBranch, projectRoot)

2. Run validation and fix any issues:

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

## Example Session

```
> /worktree init quick-fix

Creating worktree...
Worktree ready at ../webapp-quick-fix
Run /worktree done when finished.

~/webapp-quick-fix (feature/quick-fix) $ _
```

```
> /worktree done

Running validation...
✓ All checks passed

Creating commits...
✓ fix: update error handling
✓ fix: correct validation logic

Cleaning up...
✓ Worktree removed

Branch: feature/quick-fix (2 commits)

To create PR:
  git push -u origin feature/quick-fix
  gh pr create

~/webapp (main) $ _
```
