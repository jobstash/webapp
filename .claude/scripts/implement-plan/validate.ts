#!/usr/bin/env npx tsx

/**
 * Validates a plan file.
 *
 * Usage: npx tsx .claude/scripts/validate.ts <plan-file>
 * Output: JSON { valid: boolean, errors: string[], taskCount?: number }
 */

import { parsePlanFile } from './parser.ts';
import type { Plan, ValidationResult } from './types.ts';

async function main() {
  const planPath = process.argv[2];

  if (!planPath) {
    console.log(
      JSON.stringify({
        valid: false,
        errors: ['Usage: validate.ts <plan-file>'],
      }),
    );
    process.exit(1);
  }

  try {
    const plan = await parsePlanFile(planPath);
    const errors = validate(plan);

    const result: ValidationResult = {
      valid: errors.length === 0,
      errors,
      taskCount: plan.tasks.length,
    };

    console.log(JSON.stringify(result, null, 2));
    process.exit(errors.length === 0 ? 0 : 1);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(JSON.stringify({ valid: false, errors: [msg] }));
    process.exit(1);
  }
}

function validate(plan: Plan): string[] {
  const errors: string[] = [];
  const taskIds = new Set(plan.tasks.map((t) => t.id));

  // Check for missing frontmatter
  if (!plan.feature) errors.push('Missing feature in frontmatter');

  // Check for duplicate IDs
  if (taskIds.size !== plan.tasks.length) {
    errors.push('Duplicate task IDs detected');
  }

  // Check dependencies reference existing tasks
  for (const task of plan.tasks) {
    for (const dep of task.dependsOn) {
      if (!taskIds.has(dep)) {
        errors.push(`Task "${task.id}" depends on unknown task "${dep}"`);
      }
    }
  }

  // Check for empty outputs
  for (const task of plan.tasks) {
    if (task.outputs.files.length === 0 && task.agent !== 'manual') {
      errors.push(`Task "${task.id}" has no output files`);
    }
  }

  // Check for cycles using DFS
  const cycleError = detectCycles(plan);
  if (cycleError) errors.push(cycleError);

  return errors;
}

function detectCycles(plan: Plan): string | null {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const taskMap = new Map(plan.tasks.map((t) => [t.id, t]));

  function dfs(id: string, path: string[]): string | null {
    if (stack.has(id)) {
      const cycle = [...path.slice(path.indexOf(id)), id].join(' → ');
      return `Circular dependency: ${cycle}`;
    }
    if (visited.has(id)) return null;

    visited.add(id);
    stack.add(id);

    const task = taskMap.get(id);
    if (task) {
      for (const dep of task.dependsOn) {
        const error = dfs(dep, [...path, id]);
        if (error) return error;
      }
    }

    stack.delete(id);
    return null;
  }

  for (const task of plan.tasks) {
    const error = dfs(task.id, []);
    if (error) return error;
  }

  return null;
}

main();
