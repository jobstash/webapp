---
name: orchestrate
description: Execute a plan file by running tasks in dependency order. Uses scripts for deterministic validation and state management, parallel subagents for task execution.
---

# Plan Orchestrator

Execute a `.plan.md` file with deterministic orchestration and **parallel subagents**.

## Usage

```
/orchestrate <plan-file>
```

## Execution Flow

### Step 1: Validate

Run the validation script:

```bash
npx tsx .claude/scripts/orchestrate/validate.ts <plan-file>
```

**If output shows `"valid": false`:** Stop. Report the errors. Do not proceed.

**If output shows `"valid": true`:** Continue to Step 2.

### Step 2: Get Next Tasks

Run the next tasks script:

```bash
npx tsx .claude/scripts/orchestrate/next.ts <plan-file> .claude/state/<feature>.state.json
```

This outputs:

- `ready`: Tasks that can be executed now (deps satisfied)
- `completed`: Already done
- `blocked`: Waiting on dependencies
- `done`: Whether all tasks are complete

**If `done` is true:** Report completion and stop.

**If `ready` is empty but `done` is false:** Report blocked status and stop.

### Step 3: Execute Ready Tasks IN PARALLEL

**CRITICAL: Run ALL ready tasks simultaneously using parallel subagents.**

Claude Code supports up to 10 concurrent subagents. Tasks with satisfied dependencies are independent and safe to parallelize.

**Invoke all ready tasks in parallel:**

```
Execute these independent tasks in parallel, each using its designated subagent:

---
Task 1 of N:
Subagent: <task.agent>
Task ID: <task.id>
Title: <task.title>

Instructions:
<task.prompt>

Input files to read: <task.inputs.files>
Additional context: <task.inputs.context>
Files to create: <task.outputs.files>
Exports to provide: <task.outputs.exports>

---
Task 2 of N:
Subagent: <task.agent>
...

---
Task 3 of N:
...

Each subagent must:
1. Read .claude/conventions.md first
2. Read any input files specified
3. Execute the task instructions
4. Create the output files
5. Report: files created, symbols exported

Run ALL tasks concurrently. Do not wait for one to finish before starting others.
```

**Subagent mapping:**

| task.agent        | Subagent                | Purpose                                                        |
| ----------------- | ----------------------- | -------------------------------------------------------------- |
| `react-architect` | `react-architect`       | Complex React features - components, hooks, data flow, testing |
| `react-qa`        | `react-qa`              | Deep pattern review and architecture validation                |
| `manual`          | (skip - report to user) | Human action required                                          |

### Step 4: Mark All Completed Tasks

After ALL parallel subagents complete, mark each task with the scripts:

**For each successful task:**

```bash
npx tsx .claude/scripts/orchestrate/update-task.ts .claude/state/<feature>.state.json <task-id> --complete --files <files-created> --exports <symbols-exported>
```

**For each failed task:**

```bash
npx tsx .claude/scripts/orchestrate/update-task.ts .claude/state/<feature>.state.json <task-id> --fail
```

### Step 5: Loop

Go back to Step 2 to get the next batch of ready tasks.

Repeat until `done` is true or no tasks are ready.

### Step 6: Report

Run status script:

```bash
npx tsx .claude/scripts/orchestrate/status.ts <plan-file> .claude/state/<feature>.state.json
```

Report the summary to the user.

---

## Why Parallel Execution?

Claude Code supports **up to 10 concurrent subagents**. Each subagent:

- Has its own context window (no pollution)
- Runs independently
- Can be a different model (Haiku for simple, Sonnet for complex)

**Example timeline for dashboard plan (8 tasks):**

```
Sequential:        Parallel:
─────────────      ─────────────
[types    ]        [types    ]
[api-1    ]        [api-1|api-2|comp-1]  ← 3 parallel
[api-2    ]        [hook-1|hook-2]       ← 2 parallel
[comp-1   ]        [comp-2   ]
[hook-1   ]        [page     ]
[hook-2   ]
[comp-2   ]        Total: 5 rounds
[page     ]

Total: 8 rounds    ~40% faster
```

## Execution Layers

The DAG naturally creates layers of independent tasks:

```
Layer 0: [types-dashboard]
              ↓
Layer 1: [api-metrics, api-chart, component-metric-card]  ← ALL PARALLEL
              ↓
Layer 2: [hook-use-metrics, hook-use-chart]               ← ALL PARALLEL
              ↓
Layer 3: [component-chart]
              ↓
Layer 4: [page-dashboard]
```

Each layer runs in parallel. Wait for entire layer to complete before starting next.

---

## State File

```
.claude/state/<feature>.state.json
```

## Error Handling

If a task fails during parallel execution:

- Mark it failed with `update-task.ts --fail`
- Other parallel tasks continue (they're independent)
- Dependent tasks will be blocked in next iteration

## Manual Tasks

Tasks with `agent: manual` appear in `blocked`.

Report to user:

```
⚠️  Manual task required: <task-id>
    <task.prompt>

When done, run:
npx tsx .claude/scripts/orchestrate/update-task.ts .claude/state/<feature>.state.json <task-id> --complete
```

## Resumability

Re-run `/orchestrate` to continue from where you left off.

Reset: `rm .claude/state/<feature>.state.json`

## Constraints

- Max 10 concurrent subagents (extras queue automatically)
- Subagents cannot communicate with each other (fine for independent tasks)
- Background subagents auto-deny non-pre-approved permissions
