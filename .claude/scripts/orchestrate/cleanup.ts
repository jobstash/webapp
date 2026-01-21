#!/usr/bin/env npx tsx

/**
 * Cleans up orchestration files (plan + state) for a feature.
 *
 * Usage: npx tsx .claude/scripts/orchestrate/cleanup.ts <feature> [--force]
 *
 * Without --force: Shows preview (summary + files to delete), does NOT delete
 * With --force: Actually deletes the files
 */

import { readFile, unlink, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { parsePlanFile } from './parser.ts';
import type { State, CleanupResult } from './types.ts';

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const forceIndex = args.indexOf('--force');
  const force = forceIndex !== -1;

  if (force) {
    args.splice(forceIndex, 1);
  }

  const feature = args[0];

  if (!feature) {
    console.error('Usage: cleanup.ts <feature> [--force]');
    process.exit(1);
  }

  const planPath = `.claude/plans/${feature}.plan.md`;
  const statePath = `.claude/state/${feature}.state.json`;

  const result: CleanupResult = {
    success: false,
    feature,
    summary: {
      total: 0,
      completed: 0,
      failed: 0,
      pending: 0,
    },
    deleted: {
      plan: false,
      state: false,
    },
    errors: [],
  };

  try {
    const planExists = await fileExists(planPath);
    const stateExists = await fileExists(statePath);

    if (!planExists && !stateExists) {
      result.errors.push(`No files found for feature "${feature}"`);
      console.error(`Error: No files found for feature "${feature}"`);
      console.error(`  Checked: ${planPath}`);
      console.error(`  Checked: ${statePath}`);
      console.log('');
      console.log(JSON.stringify(result, null, 2));
      process.exit(1);
    }

    // Load state for summary
    let state: State | null = null;
    if (stateExists) {
      try {
        const content = await readFile(statePath, 'utf-8');
        state = JSON.parse(content);
      } catch {
        // Invalid state file
      }
    }

    // Load plan for total count
    let totalTasks = 0;
    if (planExists) {
      try {
        const plan = await parsePlanFile(planPath);
        totalTasks = plan.tasks.length;
      } catch {
        // Invalid plan file
      }
    }

    // Compute summary
    const completed = state?.completed.length ?? 0;
    const failed = state?.failed.length ?? 0;
    result.summary = {
      total: totalTasks || completed + failed,
      completed,
      failed,
      pending: Math.max(
        0,
        (totalTasks || completed + failed) - completed - failed,
      ),
    };

    // Output
    console.log(`\n=== Cleanup: ${feature} ===`);
    console.log('');
    console.log('Summary before deletion:');
    console.log(`  Total tasks: ${result.summary.total}`);
    const pct =
      result.summary.total > 0
        ? Math.round((completed / result.summary.total) * 100)
        : 0;
    console.log(`  Completed: ${completed} (${pct}%)`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Pending: ${result.summary.pending}`);

    if (state && state.completed.length > 0) {
      console.log('');
      console.log('Completed tasks:');
      for (const id of state.completed) {
        console.log(`  - ${id}`);
      }
    }

    console.log('');
    console.log('Files to delete:');
    if (planExists) console.log(`  - ${planPath}`);
    if (stateExists) console.log(`  - ${statePath}`);

    if (!force) {
      console.log('');
      console.log('Run with --force to delete files.');
      console.log('');
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    // Delete files
    console.log('');
    console.log('Deleting...');

    if (planExists) {
      try {
        await unlink(planPath);
        result.deleted.plan = true;
        console.log(`  Deleted: ${planPath}`);
      } catch (e) {
        result.errors.push(
          `Failed to delete ${planPath}: ${e instanceof Error ? e.message : e}`,
        );
        console.error(`  Failed to delete: ${planPath}`);
      }
    }

    if (stateExists) {
      try {
        await unlink(statePath);
        result.deleted.state = true;
        console.log(`  Deleted: ${statePath}`);
      } catch (e) {
        result.errors.push(
          `Failed to delete ${statePath}: ${e instanceof Error ? e.message : e}`,
        );
        console.error(`  Failed to delete: ${statePath}`);
      }
    }

    result.success = result.errors.length === 0;
    console.log('');
    console.log(
      result.success ? 'Cleanup complete.' : 'Cleanup completed with errors.',
    );
    console.log('');
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    result.errors.push(e instanceof Error ? e.message : String(e));
    console.error('Error:', e instanceof Error ? e.message : e);
    console.log('');
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }
}

main();
