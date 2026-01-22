#!/usr/bin/env npx tsx

/**
 * Shows execution status for a plan.
 *
 * Usage: npx tsx .claude/scripts/status.ts <plan-file> [state-file] [--json]
 *
 * Output:
 *   Without --json: Human-readable status
 *   With --json: JSON summary only (for programmatic use)
 */

import { parsePlanFile } from './parser.ts';
import { loadState } from './state.ts';

async function main() {
  const args = process.argv.slice(2);
  const jsonOnly = args.includes('--json');
  const positionalArgs = args.filter((a) => !a.startsWith('--'));

  const planPath = positionalArgs[0];
  const statePath = positionalArgs[1];

  if (!planPath) {
    console.error('Usage: status.ts <plan-file> [state-file] [--json]');
    process.exit(1);
  }

  try {
    const plan = await parsePlanFile(planPath);
    const state = await loadState(statePath, plan.feature);

    const completedSet = new Set(state.completed);
    const failedSet = new Set(state.failed);

    // Compute stats
    const total = plan.tasks.length;
    const completed = state.completed.length;
    const failed = state.failed.length;
    const pending = total - completed - failed;

    // Compute ready
    const ready: string[] = [];
    for (const task of plan.tasks) {
      if (completedSet.has(task.id) || failedSet.has(task.id)) continue;
      if (task.agent === 'manual') continue;
      const pendingDeps = task.dependsOn.filter((d) => !completedSet.has(d));
      if (pendingDeps.length === 0) ready.push(task.id);
    }

    const summary = {
      feature: plan.feature,
      total,
      completed,
      failed,
      pending,
      ready,
      done: pending === 0,
    };

    // JSON only mode
    if (jsonOnly) {
      console.log(JSON.stringify(summary, null, 2));
      process.exit(0);
    }

    // Human-readable output
    console.log(`\n=== Plan: ${plan.feature} ===`);
    console.log(
      `Total: ${total} | Completed: ${completed} | Failed: ${failed} | Pending: ${pending}`,
    );
    console.log(
      `Ready to execute: ${ready.length > 0 ? ready.join(', ') : '(none)'}`,
    );

    if (state.completed.length > 0) {
      console.log(`\nCompleted tasks:`);
      for (const id of state.completed) {
        const out = state.outputs[id];
        console.log(
          `  ✓ ${id}${out?.files.length ? ` → ${out.files.join(', ')}` : ''}`,
        );
      }
    }

    if (state.failed.length > 0) {
      console.log(`\nFailed tasks:`);
      for (const id of state.failed) {
        console.log(`  ✗ ${id}`);
      }
    }

    console.log('');
  } catch (e) {
    console.error('Error:', e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

main();
