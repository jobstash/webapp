#!/usr/bin/env npx tsx

/**
 * Computes the next ready tasks based on plan and state.
 *
 * Usage: npx tsx .claude/scripts/next.ts <plan-file> [state-file]
 * Output: JSON { ready: Task[], completed: string[], blocked: [...], done: boolean }
 */

import { parsePlanFile } from './parser.ts';
import { loadState } from './state.ts';
import type { NextTasksResult, Task } from './types.ts';

async function main() {
  const planPath = process.argv[2];
  const statePath = process.argv[3];

  if (!planPath) {
    console.error('Usage: next.ts <plan-file> [state-file]');
    process.exit(1);
  }

  try {
    const plan = await parsePlanFile(planPath);
    const state = await loadState(statePath, plan.feature);

    const completedSet = new Set(state.completed);
    const failedSet = new Set(state.failed);

    const ready: Task[] = [];
    const blocked: { id: string; waiting: string[] }[] = [];

    for (const task of plan.tasks) {
      // Skip completed or failed
      if (completedSet.has(task.id) || failedSet.has(task.id)) continue;

      // Skip manual tasks in ready list (report separately)
      if (task.agent === 'manual') {
        blocked.push({ id: task.id, waiting: ['manual-action-required'] });
        continue;
      }

      // Check if all deps are completed
      const pendingDeps = task.dependsOn.filter((d) => !completedSet.has(d));

      if (pendingDeps.length === 0) {
        ready.push(task);
      } else {
        blocked.push({ id: task.id, waiting: pendingDeps });
      }
    }

    const executableTasks = plan.tasks.filter((t) => t.agent !== 'manual');
    const done =
      executableTasks.length > 0 &&
      executableTasks.every(
        (t) => completedSet.has(t.id) || failedSet.has(t.id),
      );

    const result: NextTasksResult = {
      ready,
      completed: state.completed,
      failed: state.failed,
      blocked,
      done,
    };

    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Error:', e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

main();
