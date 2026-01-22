#!/usr/bin/env npx tsx

/**
 * Creates atomic commits from commit groups.
 *
 * Usage: npx tsx .claude/scripts/worktree/commit.ts --path=<worktree>
 *
 * Reads commit groups from analyze.ts output (piped or from stdin).
 * Creates commits in dependency order.
 *
 * Output: JSON with commit results
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { CommitGroup, CommitResult, WorktreeMetadata } from './types.js';

const execSafe = (cmd: string, options?: { cwd?: string }): string | null => {
  try {
    return execSync(cmd, { encoding: 'utf-8', ...options }).trim();
  } catch {
    return null;
  }
};

const parseArgs = (
  args: string[],
): { path: string; groups: CommitGroup[] | null } => {
  let path = process.cwd();
  let groupsFile: string | null = null;

  for (const arg of args) {
    if (arg.startsWith('--path=')) {
      path = arg.slice('--path='.length);
    }
    if (arg.startsWith('--groups=')) {
      groupsFile = arg.slice('--groups='.length);
    }
  }

  let groups: CommitGroup[] | null = null;
  if (groupsFile && existsSync(groupsFile)) {
    const data = JSON.parse(readFileSync(groupsFile, 'utf-8'));
    groups = data.commitGroups ?? data;
  }

  return { path: resolve(path), groups };
};

const main = (): void => {
  const args = process.argv.slice(2);
  const { path: worktreePath, groups: providedGroups } = parseArgs(args);

  const metadataPath = resolve(worktreePath, '.claude-worktree.json');

  if (!existsSync(metadataPath)) {
    const result: CommitResult = {
      success: false,
      error: `Not a worktree: ${worktreePath}`,
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  const metadata: WorktreeMetadata = JSON.parse(
    readFileSync(metadataPath, 'utf-8'),
  );

  // Get commit groups - either from args or by running analyze
  let commitGroups: CommitGroup[];

  if (providedGroups) {
    commitGroups = providedGroups;
  } else {
    // Run analyze to get commit groups
    const analyzeOutput = execSafe(
      `npx tsx .claude/scripts/worktree/analyze.ts --path="${worktreePath}"`,
      { cwd: metadata.projectRoot },
    );

    if (!analyzeOutput) {
      const result: CommitResult = {
        success: false,
        error: 'Failed to analyze changes',
      };
      console.log(JSON.stringify(result, null, 2));
      process.exit(1);
    }

    const analyzeResult = JSON.parse(analyzeOutput);
    if (!analyzeResult.success) {
      const result: CommitResult = {
        success: false,
        error: analyzeResult.error ?? 'Analyze failed',
      };
      console.log(JSON.stringify(result, null, 2));
      process.exit(1);
    }

    commitGroups = analyzeResult.commitGroups ?? [];
  }

  if (commitGroups.length === 0) {
    const result: CommitResult = {
      success: true,
      commits: [],
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }

  const commits: string[] = [];

  // Create commits
  for (const group of commitGroups) {
    // Stage files
    for (const file of group.files) {
      execSafe(`git add "${file}"`, { cwd: worktreePath });
    }

    // Check if there's anything staged
    const staged = execSafe('git diff --cached --name-only', {
      cwd: worktreePath,
    });

    if (staged) {
      // Use stdin to avoid shell escaping issues with quotes in messages
      execSync('git commit -F -', {
        cwd: worktreePath,
        input: group.message,
        encoding: 'utf-8',
      });
      commits.push(group.message);
    }
  }

  const result: CommitResult = {
    success: true,
    commits,
  };
  console.log(JSON.stringify(result, null, 2));
};

main();
