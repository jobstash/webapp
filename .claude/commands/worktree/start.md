---
description: Create worktree and execute plan file autonomously
---

# Worktree Start

Create a git worktree for isolated development and execute a plan file autonomously.

## Usage

```
/worktree:start <branch> <plan-file-path>
```

**Arguments (from $ARGUMENTS):**

- First argument: Branch name (e.g., `feat/salary-filter`)
- Second argument: Plan file path (e.g., `docs/plan/PLAN-feat-salary-filter.local.md`)

## Prerequisites

- Must be in main repository (not already in a worktree)
- Plan file must exist and follow planning format

## Package Manager

**Always use pnpm** - never use npm or yarn:

- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add a package
- `pnpm dlx <command>` - Execute a package (instead of npx)
- `pnpm run <script>` - Run a script
- `pnpm lint`, `pnpm build`, `pnpm test` - Common scripts

## Workflow Overview

```
Parse args → Validate plan → Create worktree → Execute tasks → Verify → Commit → Cleanup
```

---

## Phase 1: Setup

### 1.1 Parse Arguments

Extract branch and plan file path from `$ARGUMENTS`:

```bash
# Example: feat/salary-filter docs/plan/PLAN-feat-salary-filter.local.md
```

If arguments missing or invalid, display:

```
Usage: /worktree:start <branch> <plan-file-path>

Examples:
  /worktree:start feat/salary-filter docs/plan/PLAN-feat-salary-filter.local.md
  /worktree:start fix/login-button docs/plan/PLAN-fix-login-button.local.md
```

### 1.2 Validate Prerequisites

Check not already in a worktree:

```bash
test -f .worktree-session.json && echo "in-worktree"
```

### 1.3 Read and Validate Plan File

Read the plan file. Validate it contains:

- `## Summary` section
- `## Tasks` section with at least one task
- Each task has `**Agent:**` assignment

If invalid, display error and stop.

### 1.4 Create Worktree

Set paths:

- `WORKTREE_NAME`: `webapp-<branch with / replaced by ->`
- `WORKTREE_PATH`: `../$WORKTREE_NAME` (absolute path)
- `MAIN_REPO`: Current directory (absolute path via `pwd`)
- `BASE_BRANCH`: Current branch via `git rev-parse --abbrev-ref HEAD`

Create the worktree:

```bash
git worktree add <WORKTREE_PATH> -b <branch> <BASE_BRANCH>
```

Copy Claude config to worktree:

```bash
cp -r .claude <WORKTREE_PATH>/
cp CLAUDE.md <WORKTREE_PATH>/
```

### 1.5 Update VS Code Workspace

Add worktree to `../jobstash.code-workspace`:

1. Read `../jobstash.code-workspace` using the Read tool
2. Parse the JSON and add a new folder entry: `{name: "<WORKTREE_NAME>", path: "<WORKTREE_NAME>"}`
3. Write the updated JSON back using the Write tool

Display setup complete:

```
================================================================================
WORKTREE CREATED
================================================================================

Branch:    <branch>
Base:      <BASE_BRANCH>
Worktree:  <WORKTREE_PATH>

================================================================================
EXECUTING PLAN
================================================================================
```

---

## Phase 2: Execute Tasks

### 2.1 Parse Tasks from Plan

Extract tasks from the plan file. Each task has:

- Title
- Description
- Agent (implementer, tester, seo-reviewer)
- Pipeline (sequence of agents)

### 2.2 Execute Each Task

For each task in order:

1. Display task being executed:

```
--------------------------------------------------------------------------------
Task N: <Title>
--------------------------------------------------------------------------------
Agent: <agent>
Pipeline: <pipeline>
```

2. Spawn the agent via `Task` tool with:
   - `subagent_type`: The agent name (e.g., `implementer`)
   - `prompt`: Task description with context
   - **Critical:** Include absolute worktree path in prompt

**Prompt template for agents:**

```
Working directory: <WORKTREE_PATH absolute>

Task: <task description>

Context from plan:
<summary section from plan>

Instructions:
- All file operations must use absolute paths starting with <WORKTREE_PATH>
- Follow project conventions in CLAUDE.md
- Do not ask questions - make reasonable decisions
```

3. After agent completes, run next agent in pipeline (e.g., `tester` after `implementer`)

4. Report results before moving to next task

### 2.3 Handle Errors

If an agent fails:

1. Display the error
2. Use `AskUserQuestion` with options:
   - "Retry this task"
   - "Skip this task and continue"
   - "Abort execution"

---

## Phase 3: Post-Implementation Review

After all tasks complete:

### 3.1 Run code-simplifier

Spawn `code-simplifier` agent on all modified files:

```
Working directory: <WORKTREE_PATH absolute>

Review and simplify all recently modified code in this worktree.
Focus on clarity, consistency, and maintainability.
```

### 3.2 Run design-reviewer

Spawn `design-reviewer` agent on UI components:

```
Working directory: <WORKTREE_PATH absolute>

Review all UI components modified in this worktree for design compliance.
```

---

## Phase 4: Verification

Run verification commands in the worktree:

```bash
cd <WORKTREE_PATH> && pnpm lint
cd <WORKTREE_PATH> && pnpm build
cd <WORKTREE_PATH> && pnpm test  # if tests exist
```

If any fail:

1. Display error
2. Attempt to fix (spawn appropriate agent)
3. Re-run verification
4. If still failing, ask user how to proceed

---

## Phase 5: Commit and Cleanup

### 5.1 Show Changes

Display diff summary:

```bash
cd <WORKTREE_PATH> && git diff --stat
```

```
================================================================================
CHANGES SUMMARY
================================================================================

<git diff --stat output>

Files changed: X, Insertions: Y, Deletions: Z

================================================================================
```

### 5.2 Confirm Commit

Use `AskUserQuestion`:

**Question:** "Ready to commit these changes?"

**Options:**

1. "Yes, commit all changes" - Proceed
2. "No, let me review first" - Show full diff, then ask again
3. "Abort" - Stop without committing

### 5.3 Commit Changes

Stage and commit:

```bash
cd <WORKTREE_PATH> && git add -A
cd <WORKTREE_PATH> && git commit -m "<message>"
```

Commit message format (use HEREDOC):

```
feat: <summary from plan>

Tasks completed:
- <task 1 title>
- <task 2 title>
...

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 5.4 Rebase on Base Branch

```bash
cd <WORKTREE_PATH> && git fetch origin <BASE_BRANCH>
cd <WORKTREE_PATH> && git rebase origin/<BASE_BRANCH>
```

If conflicts:

```
CONFLICT: Rebase has conflicts.

Please resolve manually:
1. cd <WORKTREE_PATH>
2. Resolve conflicts
3. git add <resolved-files>
4. git rebase --continue
```

Stop here if conflicts exist.

### 5.5 Cleanup

Remove from VS Code workspace:

1. Read `../jobstash.code-workspace` using the Read tool
2. Parse the JSON and filter out the folder entry where `path === "<WORKTREE_NAME>"`
3. Write the updated JSON back using the Write tool

Remove worktree:

```bash
cd <MAIN_REPO> && git worktree remove <WORKTREE_PATH> --force
```

Delete the plan file (it's been executed):

```bash
rm <MAIN_REPO>/<plan-file-path>
```

### 5.6 Display Completion

```
================================================================================
EXECUTION COMPLETE
================================================================================

Branch '<branch>' is ready and fast-forward mergeable to <BASE_BRANCH>.

================================================================================
MERGE OPTIONS
================================================================================

Option 1 - Local merge:
  git checkout <BASE_BRANCH>
  git merge <branch>
  git branch -d <branch>

Option 2 - Push for PR:
  git push -u origin <branch>
  # Create PR on GitHub

================================================================================
```

---

## Important Notes

- **All paths must be absolute** - Agents work in their own context
- **No user interaction during execution** - Agents make decisions autonomously
- **Worktree is auto-cleaned** - No manual cleanup needed after success
- **Plan file is auto-deleted** - Removed after successful execution
- **Plan file format** - Must match planning output format (from `/planning`)
- **Always use pnpm** - Use `pnpm install`, `pnpm dlx` (not npx), `pnpm add`, etc.
