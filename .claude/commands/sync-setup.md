---
name: sync-setup
description: Update Claude setup to match agent and skills structure. Syncs orchestration scripts with agents defined in .claude/agents/.
---

# Sync Setup

Synchronize the orchestration configuration with the current agents and skills structure.

## Usage

```
/sync-setup
```

## What This Does

1. Scans `.claude/agents/` for all agent definitions
2. Updates `.claude/scripts/implement-plan/types.ts` with the `AgentType` union
3. Updates `.claude/scripts/implement-plan/parser.ts` with the `VALID_AGENTS` array
4. Outputs the subagent mapping table for `implement-plan.md`

## Execution

Run the sync script:

```bash
npx tsx .claude/scripts/sync-agents.ts
```

## Expected Output

```
Syncing agents configuration...

Found 2 agents: react-architect, react-qa

✓ Updated types.ts with AgentType: 'react-architect' | 'react-qa' | 'manual'
✓ Updated parser.ts with VALID_AGENTS: ['react-architect', 'react-qa', 'manual']

--- Subagent mapping for implement-plan.md ---

**Subagent mapping:**

| task.agent | Subagent | Purpose |
|------------|----------|---------|
| `react-architect` | `react-architect` | ... |
| `react-qa` | `react-qa` | ... |
| `manual` | (skip - report to user) | Human action required |

✓ Copy the table above to .claude/commands/implement-plan.md if needed
```

## After Running

If the subagent mapping table changed, update `.claude/commands/implement-plan.md` Step 3 with the new table.

## When to Run

Run this command after:

- Adding a new agent in `.claude/agents/`
- Removing an agent
- Changing an agent's name or description

## Files Modified

| File                                       | What Changes           |
| ------------------------------------------ | ---------------------- |
| `.claude/scripts/implement-plan/types.ts`  | `AgentType` union type |
| `.claude/scripts/implement-plan/parser.ts` | `VALID_AGENTS` array   |

## Manual Step

The `implement-plan.md` subagent mapping table is printed but not auto-updated. Copy it manually if the agents changed.
