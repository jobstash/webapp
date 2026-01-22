#!/usr/bin/env npx tsx

/**
 * Analyzes changes in a worktree and returns commit groups.
 *
 * Usage: npx tsx .claude/scripts/worktree/analyze.ts [--path=<worktree>]
 *
 * --path=<dir>: Path to worktree (defaults to cwd)
 *
 * Output: JSON with changes and commitGroups
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  WorktreeMetadata,
  FileChange,
  CommitGroup,
  AnalyzeResult,
} from './types.js';

const execSafe = (cmd: string, options?: { cwd?: string }): string | null => {
  try {
    return execSync(cmd, { encoding: 'utf-8', ...options }).trim();
  } catch {
    return null;
  }
};

/**
 * Extracts atomic category from file path for granular commit grouping.
 *
 * Principles:
 * - Schemas/types first (no dependencies)
 * - Utilities (like cn) before components that use them
 * - Each component directory is its own category
 * - Order by dependency graph
 * - API and data layer separate
 * - Pages last
 */
const categorizeFile = (rawPath: string): string => {
  const path = rawPath.startsWith('src/') ? rawPath : `src/${rawPath}`;

  // Infrastructure: tsconfig, package.json, etc
  if (rawPath.match(/^(tsconfig|package|pnpm-lock|next\.config)/)) {
    return 'infra';
  }

  // Root app files (layout, page, globals, favicon)
  if (path.match(/^src\/app\/(layout|page|globals|favicon)/)) {
    return 'app-base';
  }

  // Schemas - always first in feature code
  if (path.match(/schemas?\.ts$/)) {
    return 'schemas';
  }

  // Types - separate from schemas if they exist
  if (path.match(/src\/types\//)) {
    return 'types';
  }

  // Utilities (lib/utils) - before components
  if (path.match(/src\/lib\/.*\.ts$/)) {
    return 'utils';
  }

  // API routes - after schemas, before server data layer
  if (path.match(/src\/app\/api\//)) {
    return 'api';
  }

  // Server data layer - after API
  if (path.match(/\/server\//)) {
    return 'server-data';
  }

  // Components - extract specific component folder for atomic commits
  const componentMatch = path.match(/\/components\/([^/]+)\//);
  if (componentMatch) {
    return `component:${componentMatch[1]}`;
  }

  // Hooks - separate each hook file
  if (path.match(/src\/hooks\//)) {
    const hookMatch = path.match(/\/hooks\/([^/]+)\.ts$/);
    if (hookMatch) {
      return `hook:${hookMatch[1]}`;
    }
    return 'hooks';
  }

  // Pages - last
  if (path.match(/page\.tsx$/)) {
    return 'pages';
  }

  // Tests
  if (rawPath.match(/\.(test|spec)\./)) {
    return 'tests';
  }

  // Docs
  if (rawPath.endsWith('.md')) {
    return 'docs';
  }

  return 'other';
};

/**
 * Determines commit order based on dependency hierarchy.
 * Lower numbers = committed first.
 */
const getCategoryOrder = (category: string): number => {
  const order: Record<string, number> = {
    infra: 0,
    'app-base': 1,
    utils: 10,
    types: 11,
    schemas: 12,
    api: 20,
    'server-data': 21,
    hooks: 30,
    pages: 90,
    tests: 95,
    docs: 96,
    other: 99,
  };

  if (category.startsWith('hook:')) {
    return 30;
  }

  if (category.startsWith('component:')) {
    const name = category.slice('component:'.length);
    // Component ordering: leaf (40) → collection (50) → container (60)
    const patterns: Record<string, number> = {
      skeleton: 40,
      card: 40,
      grid: 50,
      list: 50,
      container: 60,
      metrics: 60,
    };
    const match = Object.entries(patterns).find(([key]) => name.includes(key));
    return match ? match[1] : 45;
  }

  return order[category] ?? 99;
};

/**
 * Generates atomic commit messages based on category.
 */
const generateCommitMessage = (category: string): string => {
  if (category.startsWith('component:')) {
    const componentName = category.slice('component:'.length);
    return `feat: add ${componentName} component`;
  }

  if (category.startsWith('hook:')) {
    const hookName = category.slice('hook:'.length);
    return `feat: add ${hookName} hook`;
  }

  const messages: Record<string, string> = {
    infra: 'chore: update project configuration',
    'app-base': 'chore: migrate to src folder structure',
    utils: 'chore: add utility functions',
    types: 'feat: add types',
    schemas: 'feat: add schemas',
    api: 'feat: add API endpoint',
    'server-data': 'feat: add server-side data fetcher',
    hooks: 'feat: add hooks',
    pages: 'feat: add page',
    tests: 'test: add tests',
    docs: 'docs: update documentation',
    other: 'chore: update files',
  };

  return messages[category] ?? 'chore: update files';
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
    const result: AnalyzeResult = {
      success: false,
      error: `Not a worktree: ${worktreePath}`,
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  const metadata: WorktreeMetadata = JSON.parse(
    readFileSync(metadataPath, 'utf-8'),
  );

  // Get changed files compared to base branch
  const diffOutput = execSafe(
    `git diff --name-status ${metadata.baseBranch}...HEAD`,
    { cwd: worktreePath },
  );

  if (!diffOutput) {
    const result: AnalyzeResult = {
      success: true,
      metadata,
      changes: [],
      commitGroups: [],
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }

  // Parse changes
  const changes: FileChange[] = diffOutput
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [status, ...pathParts] = line.split('\t');
      const filePath = pathParts.join('\t');
      return {
        status: status.charAt(0),
        path: filePath,
        category: categorizeFile(filePath),
      };
    });

  // Group by category
  const groupedChanges = new Map<string, FileChange[]>();
  for (const change of changes) {
    const existing = groupedChanges.get(change.category) ?? [];
    existing.push(change);
    groupedChanges.set(change.category, existing);
  }

  // Create commit groups, sorted by dependency order
  const commitGroups: CommitGroup[] = Array.from(groupedChanges.entries())
    .sort(([a], [b]) => getCategoryOrder(a) - getCategoryOrder(b))
    .map(([category, categoryChanges]) => ({
      category,
      message: generateCommitMessage(category),
      files: categoryChanges.map((c) => c.path),
    }));

  const result: AnalyzeResult = {
    success: true,
    metadata,
    changes,
    commitGroups,
  };
  console.log(JSON.stringify(result, null, 2));
};

main();
