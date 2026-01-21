#!/usr/bin/env npx tsx

/**
 * Analyzes changes in a worktree and prepares commit groups.
 *
 * Usage: npx tsx .claude/scripts/worktree/finalize.ts [--path=<worktree>] [--commit] [--cleanup]
 *
 * --path=<dir>: Path to worktree (defaults to cwd)
 * Without flags: Analyzes and outputs commit plan (dry run)
 * --commit: Actually creates the commits
 * --cleanup: Removes the worktree after committing
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { removeWorktreeFromWorkspace } from './workspace.js';

interface WorktreeMetadata {
  feature: string;
  plan: string;
  baseBranch: string;
  branchName: string;
  createdAt: string;
  projectRoot: string;
}

interface FileChange {
  status: string; // A, M, D, R
  path: string;
  category: string;
}

interface CommitGroup {
  category: string;
  message: string;
  files: string[];
}

interface FinalizeResult {
  success: boolean;
  inWorktree: boolean;
  metadata?: WorktreeMetadata;
  changes?: FileChange[];
  commitGroups?: CommitGroup[];
  committed?: boolean;
  cleanedUp?: boolean;
  error?: string;
}

function exec(cmd: string, options?: { cwd?: string }): string {
  return execSync(cmd, { encoding: 'utf-8', ...options }).trim();
}

function execSafe(cmd: string, options?: { cwd?: string }): string | null {
  try {
    return exec(cmd, options);
  } catch {
    return null;
  }
}

/**
 * Extracts atomic category from file path for granular commit grouping.
 *
 * Principles:
 * - Schemas/types first (no dependencies)
 * - Utilities (like cn) before components that use them
 * - Each component directory is its own category
 * - Order by dependency graph (metric-card before metrics-grid before dashboard-metrics)
 * - API and data layer separate
 * - Pages last
 */
function categorizeFile(rawPath: string): string {
  const path = rawPath.startsWith('src/') ? rawPath : `src/${rawPath}`;

  // Infrastructure: tsconfig, package.json, etc
  if (rawPath.match(/^(tsconfig|package|pnpm-lock|next\.config)/))
    return 'infra';

  // Root app files (layout, page, globals, favicon)
  if (path.match(/^src\/app\/(layout|page|globals|favicon)/)) return 'app-base';

  // Schemas - always first in feature code
  if (path.match(/schemas?\.ts$/)) return 'schemas';

  // Types - separate from schemas if they exist
  if (path.match(/src\/types\//)) return 'types';

  // Utilities (lib/utils) - before components
  if (path.match(/src\/lib\/.*\.ts$/)) return 'utils';

  // API routes - after schemas, before server data layer
  if (path.match(/src\/app\/api\//)) return 'api';

  // Server data layer - after API
  if (path.match(/\/server\//)) return 'server-data';

  // Components - extract specific component folder for atomic commits
  const componentMatch = path.match(/\/components\/([^/]+)\//);
  if (componentMatch) return `component:${componentMatch[1]}`;

  // Hooks - separate each hook file
  if (path.match(/src\/hooks\//)) {
    const hookMatch = path.match(/\/hooks\/([^/]+)\.ts$/);
    if (hookMatch) return `hook:${hookMatch[1]}`;
    return 'hooks';
  }

  // Pages - last
  if (path.match(/page\.tsx$/)) return 'pages';

  // Tests
  if (rawPath.match(/\.(test|spec)\./)) return 'tests';

  // Docs
  if (rawPath.endsWith('.md')) return 'docs';

  return 'other';
}

/**
 * Determines commit order based on dependency hierarchy.
 * Lower numbers = committed first.
 */
function getCategoryOrder(category: string): number {
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

  if (category.startsWith('hook:')) return 30;

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
}

/**
 * Generates atomic commit messages based on category.
 *
 * Uses commitlint convention without scopes since the feature branch
 * already provides context (e.g., "feat: add schemas" on feature/dashboard branch).
 */
function generateCommitMessage(category: string): string {
  // Handle component:* categories
  if (category.startsWith('component:')) {
    const componentName = category.slice('component:'.length);
    return `feat: add ${componentName} component`;
  }

  // Handle hook:* categories
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
}

function parseArgs(args: string[]): {
  path: string;
  commit: boolean;
  cleanup: boolean;
} {
  let path = process.cwd();
  const commit = args.includes('--commit');
  const cleanup = args.includes('--cleanup');

  for (const arg of args) {
    if (arg.startsWith('--path=')) {
      path = arg.slice('--path='.length);
    }
  }

  return { path: resolve(path), commit, cleanup };
}

function main() {
  const args = process.argv.slice(2);
  const {
    path: worktreePath,
    commit: shouldCommit,
    cleanup: shouldCleanup,
  } = parseArgs(args);

  try {
    // Check if we're in a worktree
    const cwd = worktreePath;
    const metadataPath = resolve(cwd, '.claude-worktree.json');

    if (!existsSync(metadataPath)) {
      const result: FinalizeResult = {
        success: false,
        inWorktree: false,
        error: `Not a worktree: ${cwd}. Use --path=<worktree> or run from worktree directory`,
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
      { cwd },
    );

    if (!diffOutput) {
      const result: FinalizeResult = {
        success: true,
        inWorktree: true,
        metadata,
        changes: [],
        commitGroups: [],
        error: 'No changes to commit',
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
        const path = pathParts.join('\t'); // Handle renamed files
        return {
          status: status.charAt(0),
          path,
          category: categorizeFile(path),
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

    // If just analyzing (dry run)
    if (!shouldCommit) {
      const result: FinalizeResult = {
        success: true,
        inWorktree: true,
        metadata,
        changes,
        commitGroups,
        committed: false,
        cleanedUp: false,
      };
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    }

    // Create commits
    for (const group of commitGroups) {
      // Stage files
      for (const file of group.files) {
        execSafe(`git add "${file}"`, { cwd });
      }

      // Check if there's anything staged
      const staged = execSafe('git diff --cached --name-only', { cwd });
      if (staged) {
        // Use stdin to avoid shell escaping issues with quotes in messages
        execSync('git commit -F -', {
          cwd,
          input: group.message,
          encoding: 'utf-8',
        });
      }
    }

    // Cleanup if requested
    if (shouldCleanup) {
      const projectRoot = metadata.projectRoot;
      const worktreePath = cwd;

      // Remove metadata file first (it's not tracked)
      if (existsSync(metadataPath)) {
        unlinkSync(metadataPath);
      }

      // Remove state files
      const stateDir = resolve(cwd, '.claude/state');
      if (existsSync(stateDir)) {
        rmSync(stateDir, { recursive: true, force: true });
      }

      // Remove worktree from VS Code workspace file
      removeWorktreeFromWorkspace(projectRoot, metadata.feature);

      // If running from project root (via --path), we can remove the worktree directly
      const runningFromProjectRoot = process.cwd() !== cwd;
      let worktreeRemoved = false;

      if (runningFromProjectRoot) {
        try {
          exec(`git worktree remove "${worktreePath}" --force`, {
            cwd: projectRoot,
          });
          worktreeRemoved = true;
        } catch (e) {
          console.error(
            `Warning: Failed to remove worktree: ${e instanceof Error ? e.message : e}`,
          );
        }
      }

      const result: FinalizeResult = {
        success: true,
        inWorktree: true,
        metadata,
        changes,
        commitGroups,
        committed: true,
        cleanedUp: worktreeRemoved,
      };
      console.log(JSON.stringify(result, null, 2));

      // If we couldn't remove the worktree, print instructions
      if (!worktreeRemoved) {
        console.error(`\nTo complete cleanup, run from project root:`);
        console.error(`  cd "${projectRoot}"`);
        console.error(`  git worktree remove "${worktreePath}" --force`);
      }
      process.exit(0);
    }

    const result: FinalizeResult = {
      success: true,
      inWorktree: true,
      metadata,
      changes,
      commitGroups,
      committed: true,
      cleanedUp: false,
    };
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    const result: FinalizeResult = {
      success: false,
      inWorktree: true,
      error: e instanceof Error ? e.message : String(e),
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }
}

main();
