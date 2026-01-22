---
description: Run comprehensive code review with domain-specific QA agents
allowed-tools: Bash(git diff:*), Bash(git status:*), Read, Task, Glob, Grep
---

# Code Review Workflow

Run a comprehensive review of changed files using specialized QA agents.

## Step 1: Identify Changed Files

Get all uncommitted changes and recently committed files:

```bash
git diff --name-only HEAD
```

If no uncommitted changes, check last commit:

```bash
git diff --name-only HEAD~1
```

## Step 2: Categorize Files by Domain

Group the changed files:

| Domain     | File Patterns                                                                         |
| ---------- | ------------------------------------------------------------------------------------- |
| **React**  | `*.tsx`, `use-*.ts`, `**/page.tsx`, `**/layout.tsx`, `**/loading.tsx`, `**/error.tsx` |
| **API**    | `app/api/**/*`, `**/server/**/*`, `*.api.ts`                                          |
| **Config** | `*.config.*`, `*.json`, `*.yaml`, `*.yml`                                             |
| **Other**  | Everything else                                                                       |

## Step 3: Launch QA Agents

Based on files found, launch appropriate agents **in parallel**:

### If React files exist:

Launch the **react-qa** agent with prompt:

```
Review these React files for pattern compliance:
[list of React files]

Provide a QA report with findings categorized by severity.
```

### If API files exist:

Launch the **api-qa** agent (when available) with prompt:

```
Review these API files for pattern compliance:
[list of API files]
```

### For all files:

Consider launching **security-qa** agent (when available) for security review.

**Note:** Run agents in parallel using multiple Task tool calls in a single message for speed.

## Step 4: Aggregate Results

After all agents complete, compile a unified report:

```markdown
# Code Review Summary

## Files Reviewed

- React: X files
- API: X files
- Other: X files

## Critical Issues (must fix before merge)

[Issues from all agents with severity: critical]

## Warnings (should fix)

[Issues from all agents with severity: warning]

## Suggestions (optional improvements)

[Issues from all agents with severity: suggestion]

## Agent Reports

### React QA

[Full react-qa report]

### API QA

[Full api-qa report if available]

### Security QA

[Full security-qa report if available]
```

## Usage Examples

```bash
# Review all uncommitted changes
/review

# Review specific directory
/review src/features/auth

# Review specific files
/review src/components/Button.tsx src/hooks/use-auth.ts
```

## Notes

- Agents run in parallel for faster reviews
- Each agent only reviews files in its domain
- Reports include file:line references for easy navigation
- Only available agents are launched (missing agents are skipped)
