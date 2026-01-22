#!/usr/bin/env npx tsx

/**
 * Sets up a worktree for a feature.
 *
 * Usage: npx tsx .claude/scripts/worktree/setup.ts <name> [--no-plan]
 *
 * --no-plan: Skip plan file validation (for lightweight worktree workflow)
 *
 * Output: JSON with worktree path and metadata
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { addWorktreeToWorkspace } from './workspace.js';
import type { WorktreeMetadata, SetupResult } from './types.js';

const exec = (cmd: string): string => {
  return execSync(cmd, { encoding: 'utf-8' }).trim();
};

/**
 * Copies gitignored files (.env, plan) to the worktree.
 */
const copyGitIgnoredFiles = (
  projectRoot: string,
  worktreePath: string,
  planPath: string | null,
): { planCopied: boolean; envCopied: boolean } => {
  let planCopied = false;
  let envCopied = false;

  // Copy plan file if exists
  if (planPath) {
    const fullPlanPath = resolve(projectRoot, planPath);
    if (existsSync(fullPlanPath)) {
      const planContent = readFileSync(fullPlanPath, 'utf-8');
      const worktreePlansDir = resolve(worktreePath, '.claude/plans');
      mkdirSync(worktreePlansDir, { recursive: true });
      writeFileSync(resolve(worktreePath, planPath), planContent);
      planCopied = true;
    }
  }

  // Copy .env file if exists
  const envPath = resolve(projectRoot, '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    writeFileSync(resolve(worktreePath, '.env'), envContent);
    envCopied = true;
  }

  return { planCopied, envCopied };
};

/**
 * Ensures .claude/plans and .claude/state are in .gitignore.
 */
const ensureGitIgnore = (projectRoot: string): void => {
  const gitignorePath = resolve(projectRoot, '.gitignore');
  let gitignore = existsSync(gitignorePath)
    ? readFileSync(gitignorePath, 'utf-8')
    : '';

  let updated = false;

  if (!gitignore.includes('.claude/plans')) {
    gitignore += '\n# Claude Code plans (temporary)\n.claude/plans/\n';
    updated = true;
  }
  if (!gitignore.includes('.claude/state')) {
    gitignore += '\n# Claude Code state\n.claude/state/\n';
    updated = true;
  }

  if (updated) {
    writeFileSync(gitignorePath, gitignore);
  }
};

const main = (): void => {
  const args = process.argv.slice(2);
  const noPlan = args.includes('--no-plan');
  const featureName = args.find((arg) => !arg.startsWith('--'));

  if (!featureName) {
    const result: SetupResult = {
      success: false,
      error: 'Usage: setup.ts <name> [--no-plan]',
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  try {
    const projectRoot = exec('git rev-parse --show-toplevel');
    const planPath = noPlan ? null : `.claude/plans/${featureName}.plan.md`;

    // Validate plan exists if required
    if (planPath) {
      const fullPlanPath = resolve(projectRoot, planPath);
      if (!existsSync(fullPlanPath)) {
        const result: SetupResult = {
          success: false,
          error: `Plan not found: ${planPath}`,
        };
        console.log(JSON.stringify(result, null, 2));
        process.exit(1);
      }
    }

    const projectName = basename(projectRoot);
    const worktreePath = resolve(
      projectRoot,
      `../${projectName}-${featureName}`,
    );
    const branchName = `feature/${featureName}`;

    // Handle existing worktree
    if (existsSync(worktreePath)) {
      const metadataPath = resolve(worktreePath, '.claude-worktree.json');
      if (existsSync(metadataPath)) {
        const metadata: WorktreeMetadata = JSON.parse(
          readFileSync(metadataPath, 'utf-8'),
        );

        // Refresh gitignored files
        const { planCopied, envCopied } = copyGitIgnoredFiles(
          projectRoot,
          worktreePath,
          planPath,
        );

        const refreshed = [planCopied ? 'plan' : null, envCopied ? 'env' : null]
          .filter(Boolean)
          .join(' and ');

        if (refreshed) {
          console.error(`Refreshed ${refreshed} files in existing worktree`);
        }

        // Ensure worktree is in VS Code workspace
        addWorktreeToWorkspace(projectRoot, featureName);

        const result: SetupResult = {
          success: true,
          worktreePath,
          metadata,
          alreadyExists: true,
        };
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
      }
    }

    // Ensure gitignore entries
    ensureGitIgnore(projectRoot);

    // Get current branch as base
    const baseBranch = exec('git branch --show-current') || 'main';

    // Check if branch already exists
    let branchExists = false;
    try {
      exec(`git rev-parse --verify ${branchName} 2>/dev/null`);
      branchExists = true;
    } catch {
      branchExists = false;
    }

    // Create worktree
    const worktreeCmd = branchExists
      ? `git worktree add "${worktreePath}" "${branchName}"`
      : `git worktree add "${worktreePath}" -b "${branchName}" "${baseBranch}"`;

    execSync(worktreeCmd, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'inherit'],
    });

    // Create metadata file
    const metadata: WorktreeMetadata = {
      feature: featureName,
      plan: planPath ?? '',
      baseBranch,
      branchName,
      createdAt: new Date().toISOString(),
      projectRoot,
    };

    const metadataPath = resolve(worktreePath, '.claude-worktree.json');
    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    // Add to VS Code workspace
    addWorktreeToWorkspace(projectRoot, featureName);

    // Ensure .claude directories exist
    mkdirSync(resolve(worktreePath, '.claude/plans'), { recursive: true });
    mkdirSync(resolve(worktreePath, '.claude/state'), { recursive: true });

    // Copy gitignored files
    copyGitIgnoredFiles(projectRoot, worktreePath, planPath);

    // Install dependencies
    console.error('Installing dependencies...');
    try {
      execSync('pnpm install --frozen-lockfile --silent', {
        cwd: worktreePath,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (error) {
      console.error(
        'Warning: pnpm install failed:',
        error instanceof Error ? error.message : String(error),
      );
    }

    const result: SetupResult = {
      success: true,
      worktreePath,
      metadata,
      alreadyExists: false,
    };

    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    const result: SetupResult = {
      success: false,
      error: e instanceof Error ? e.message : String(e),
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }
};

main();
