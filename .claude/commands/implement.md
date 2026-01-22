---
name: implement
description: Create a worktree for a feature plan and start orchestration. Combines worktree setup with plan execution in a single command.
---

# Implement Feature

Create a worktree for a feature and run the orchestration.

## Usage

```
/implement <plan-name>
```

Where `<plan-name>` is the feature slug matching `.claude/plans/<plan-name>.plan.md`

## Execution Flow

### Step 1: Setup Worktree

Run the worktree setup script:

```bash
npx tsx .claude/scripts/worktree/setup.ts <plan-name>
```

**If output shows `"success": false`:** Report the error and stop.

Possible errors:

- Plan not found → User needs to create the plan first with `/create-plan`

**If output shows `"alreadyExists": true`:**

- Worktree already exists, will resume from existing state
- Report this to user

**If output shows `"success": true`:**

- Note the `worktreePath` from the output
- Note the `metadata.baseBranch` for later

### Step 2: Change to Worktree Directory

**CRITICAL: Change working directory to the worktree.**

```bash
cd <worktreePath>
```

For example (if project is named `myproject`):

```bash
cd ../myproject-dashboard
```

Verify the change:

```bash
pwd
```

This should now show the worktree path.

### Step 3: Run Orchestration

Now execute the orchestration within the worktree context:

```bash
npx tsx .claude/scripts/orchestrate/validate.ts .claude/plans/<plan-name>.plan.md
```

If valid, proceed with the full orchestration loop:

1. Get ready tasks:

   ```bash
   npx tsx .claude/scripts/orchestrate/next.ts .claude/plans/<plan-name>.plan.md .claude/state/<plan-name>.state.json
   ```

2. Execute ready tasks in parallel using subagents (as per orchestrate command)

3. Mark tasks complete:

   ```bash
   npx tsx .claude/scripts/orchestrate/update-task.ts .claude/state/<plan-name>.state.json <task-id> --complete --files <files> --exports <exports>
   ```

4. Loop until done

### Step 4: Report Completion

When orchestration completes (all tasks done), report:

```
✓ Implementation complete

Feature: <plan-name>
Branch: feature/<plan-name>
Worktree: ../<project>-<plan-name>

Session is now active in the worktree.
You can run additional commands or inspect files.

When ready, run /finalize to:
- Create atomic commits for changes
- Clean up the worktree
- Return to main project
```

**IMPORTANT: Do not exit or change directory after orchestration. Stay in the worktree so user can:**

- Run additional commands
- Inspect/modify files
- Fix any issues
- Run `/finalize` when ready

---

## Resuming

If `/implement <plan-name>` is run and the worktree already exists:

1. Script returns `"alreadyExists": true`
2. cd into the worktree
3. Run `next.ts` to see current state
4. Continue orchestration from where it left off

This allows resuming interrupted implementations.

---

## Example Session

```
~/project (main) $ claude

> /implement dashboard

Setting up worktree for dashboard...
✓ Created worktree at ../project-dashboard
✓ Branch: feature/dashboard (from main)

Changing to worktree directory...
✓ Now in /home/user/project-dashboard

Starting orchestration...

Validating plan...
✓ Plan valid: 8 tasks

Executing tasks...

Layer 0: [types-dashboard]
→ typescript-types subagent
✓ types-dashboard complete

Layer 1: [api-metrics, api-chart, component-metric-card]
→ Running 3 subagents in parallel
✓ api-metrics complete
✓ api-chart complete
✓ component-metric-card complete

[... continues ...]

✓ Implementation complete

Feature: dashboard
Branch: feature/dashboard
Worktree: ../project-dashboard

Run /finalize when ready to commit and clean up.

> _
```

User can now run more commands, and the working directory is `../project-dashboard`.
