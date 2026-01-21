#!/usr/bin/env npx tsx

/**
 * Marks a task as completed or failed and updates state.
 *
 * Usage:
 *   npx tsx update-task.ts <state-file> <task-id> --complete [--files f1,f2] [--exports e1,e2]
 *   npx tsx update-task.ts <state-file> <task-id> --fail [--error "message"]
 *
 * Output: JSON { success: boolean, state: State }
 */

import { loadState, saveState } from './state.ts';

function parseArgs(args: string[]) {
  const statePath = args[0];
  const taskId = args[1];
  const isComplete = args.includes('--complete');
  const isFail = args.includes('--fail');

  const filesIdx = args.indexOf('--files');
  const exportsIdx = args.indexOf('--exports');

  const files =
    filesIdx !== -1
      ? (args[filesIdx + 1]?.split(',').filter(Boolean) ?? [])
      : [];
  const exports =
    exportsIdx !== -1
      ? (args[exportsIdx + 1]?.split(',').filter(Boolean) ?? [])
      : [];

  return { statePath, taskId, isComplete, isFail, files, exports };
}

async function main() {
  const args = process.argv.slice(2);
  const { statePath, taskId, isComplete, isFail, files, exports } =
    parseArgs(args);

  if (!statePath || !taskId || (!isComplete && !isFail)) {
    console.error(
      'Usage: update-task.ts <state-file> <task-id> --complete|--fail [--files f1,f2] [--exports e1,e2]',
    );
    process.exit(1);
  }

  if (isComplete && isFail) {
    console.error('Cannot use both --complete and --fail');
    process.exit(1);
  }

  try {
    const state = await loadState(statePath);

    if (isComplete) {
      if (!state.completed.includes(taskId)) {
        state.completed.push(taskId);
      }
      state.failed = state.failed.filter((id) => id !== taskId);
      state.outputs[taskId] = { files, exports };
    } else {
      if (!state.failed.includes(taskId)) {
        state.failed.push(taskId);
      }
    }

    state.lastRun = new Date().toISOString();

    await saveState(statePath, state);

    console.log(JSON.stringify({ success: true, state }, null, 2));
  } catch (e) {
    console.error('Error:', e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

main();
