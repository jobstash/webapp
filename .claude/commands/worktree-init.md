---
name: worktree-init
description: Create an isolated worktree for quick work without a formal plan
hint-args: '<name>'
---

# Worktree Init

Create an isolated git worktree for ad-hoc work.

## Usage

```
/worktree-init <name>
```

## Execution

1. Run setup script:

   ```bash
   npx tsx .claude/scripts/worktree/setup.ts <name> --no-plan
   ```

2. Parse JSON output for `worktreePath` and `success`

3. If `success: false`, report error and stop.

4. If `alreadyExists: true`, report resumption.

5. Report with terminal instructions:

   ```
   ✓ Worktree ready at `<worktreePath>`
   Branch: `feature/<name>`

   To start working, run in your terminal:
     cd <worktreePath> && claude

   When done, run `/worktree-done` from the worktree session.
   ```

## Error Handling

- No name provided: "Usage: /worktree-init \<name\>"
- Setup failed: Report the error from JSON output

## Example

```
> /worktree-init quick-fix

Creating worktree...
✓ Worktree ready at /Users/john/code/webapp-quick-fix
Branch: feature/quick-fix

To start working, run in your terminal:
  cd /Users/john/code/webapp-quick-fix && claude

When done, run /worktree-done from the worktree session.
```
