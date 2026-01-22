#!/usr/bin/env npx tsx

/**
 * Cleans up a worktree after commits are created.
 *
 * Usage: npx tsx .claude/scripts/worktree/cleanup.ts --path=<worktree>
 *
 * Removes:
 * - .claude-worktree.json metadata file
 * - .claude/plans/ directory (copies from main project)
 * - .claude/state/ directory (execution state)
 * - VS Code workspace entry
 * - Git worktree directory
 *
 * Output: JSON with cleanup results
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { removeWorktreeFromWorkspace } from './workspace.js';
import type { WorktreeMetadata, CleanupResult } from './types.js';

const exec = (cmd: string, options?: { cwd?: string }): string => {
  return execSync(cmd, { encoding: 'utf-8', ...options }).trim();
};

const parseArgs = (args: string[]): { path: string } => {
  let path = process.cwd();

  for (const arg of args) {
    if (arg.startsWith('--path=')) {
      path = arg.slice('--path='.length);
    }
  }

  return { path: resolve(path) };
};

const main = (): void => {
  const args = process.argv.slice(2);
  const { path: worktreePath } = parseArgs(args);

  const metadataPath = resolve(worktreePath, '.claude-worktree.json');

  if (!existsSync(metadataPath)) {
    const result: CleanupResult = {
      success: false,
      error: `Not a worktree: ${worktreePath}`,
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  const metadata: WorktreeMetadata = JSON.parse(
    readFileSync(metadataPath, 'utf-8'),
  );

  const projectRoot = metadata.projectRoot;

  // Remove metadata file (not tracked)
  if (existsSync(metadataPath)) {
    unlinkSync(metadataPath);
  }

  // Remove plan and state files inside worktree (copies from main project)
  const plansDir = resolve(worktreePath, '.claude/plans');
  if (existsSync(plansDir)) {
    rmSync(plansDir, { recursive: true, force: true });
  }

  const stateDir = resolve(worktreePath, '.claude/state');
  if (existsSync(stateDir)) {
    rmSync(stateDir, { recursive: true, force: true });
  }

  // Remove worktree from VS Code workspace file
  removeWorktreeFromWorkspace(projectRoot, metadata.feature);

  // Attempt to remove the worktree directory
  let worktreeRemoved = false;

  try {
    exec(`git worktree remove "${worktreePath}" --force`, {
      cwd: projectRoot,
    });
    worktreeRemoved = true;
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error(`Warning: Failed to remove worktree: ${errorMsg}`);
    console.error(`\nTo complete cleanup, run from project root:`);
    console.error(`  cd "${projectRoot}"`);
    console.error(`  git worktree remove "${worktreePath}" --force`);
  }

  const result: CleanupResult = {
    success: true,
    cleanedUp: worktreeRemoved,
  };
  console.log(JSON.stringify(result, null, 2));
};

main();
