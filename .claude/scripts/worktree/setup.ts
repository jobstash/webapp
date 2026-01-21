#!/usr/bin/env npx tsx

/**
 * Sets up a worktree for a feature plan.
 *
 * Usage: npx tsx .claude/scripts/worktree/setup.ts <plan-name>
 * Example: npx tsx .claude/scripts/worktree/setup.ts dashboard
 *
 * Output: JSON with worktree path and metadata
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { addWorktreeToWorkspace } from './workspace.js';

interface WorktreeMetadata {
  feature: string;
  plan: string;
  baseBranch: string;
  branchName: string;
  createdAt: string;
  projectRoot: string;
}

interface SetupResult {
  success: boolean;
  worktreePath?: string;
  metadata?: WorktreeMetadata;
  error?: string;
  alreadyExists?: boolean;
}

function exec(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8' }).trim();
}

function main() {
  const planName = process.argv[2];

  if (!planName) {
    const result: SetupResult = {
      success: false,
      error: 'Usage: setup.ts <plan-name>',
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  try {
    const projectRoot = exec('git rev-parse --show-toplevel');
    const planPath = `.claude/plans/${planName}.plan.md`;
    const fullPlanPath = resolve(projectRoot, planPath);

    // Check if plan exists
    if (!existsSync(fullPlanPath)) {
      const result: SetupResult = {
        success: false,
        error: `Plan not found: ${planPath}`,
      };
      console.log(JSON.stringify(result, null, 2));
      process.exit(1);
    }

    // Read plan content now (before worktree creation) so we can copy it later
    const planContent = readFileSync(fullPlanPath, 'utf-8');

    // Read .env file if it exists (gitignored, needs to be copied)
    const envPath = resolve(projectRoot, '.env');
    const envContent = existsSync(envPath)
      ? readFileSync(envPath, 'utf-8')
      : null;

    const projectName = basename(projectRoot);
    const worktreePath = resolve(projectRoot, `../${projectName}-${planName}`);
    const branchName = `feature/${planName}`;

    // Check if worktree already exists
    if (existsSync(worktreePath)) {
      // Read existing metadata
      const metadataPath = resolve(worktreePath, '.claude-worktree.json');
      if (existsSync(metadataPath)) {
        const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));

        // Ensure plan file is copied (it's gitignored, may not exist or may be stale)
        const worktreePlansDir = resolve(worktreePath, '.claude/plans');
        mkdirSync(worktreePlansDir, { recursive: true });
        const worktreePlanPath = resolve(worktreePath, planPath);
        writeFileSync(worktreePlanPath, planContent);

        // Copy .env file (gitignored, needs to be refreshed)
        if (envContent) {
          const worktreeEnvPath = resolve(worktreePath, '.env');
          writeFileSync(worktreeEnvPath, envContent);
        }

        console.error('Refreshed plan and env files in existing worktree');

        // Ensure worktree is in VS Code workspace (may have been removed)
        addWorktreeToWorkspace(projectRoot, planName);

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

    // Get current branch as base
    const baseBranch = exec('git branch --show-current') || 'main';

    // Ensure .claude/plans are gitignored
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

    // Check if branch already exists
    let branchExists = false;
    try {
      exec(`git rev-parse --verify ${branchName} 2>/dev/null`);
      branchExists = true;
    } catch {
      branchExists = false;
    }

    // Create worktree (suppress stdout to avoid polluting JSON output)
    if (branchExists) {
      execSync(`git worktree add "${worktreePath}" "${branchName}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'inherit'],
      });
    } else {
      execSync(
        `git worktree add "${worktreePath}" -b "${branchName}" "${baseBranch}"`,
        {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'inherit'],
        },
      );
    }

    // Create metadata file
    const metadata: WorktreeMetadata = {
      feature: planName,
      plan: planPath,
      baseBranch,
      branchName,
      createdAt: new Date().toISOString(),
      projectRoot,
    };

    const metadataPath = resolve(worktreePath, '.claude-worktree.json');
    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    // Add worktree to VS Code workspace for proper TypeScript intellisense
    addWorktreeToWorkspace(projectRoot, planName);

    // Ensure .claude directories exist in worktree
    const worktreePlansDir = resolve(worktreePath, '.claude/plans');
    const worktreeStateDir = resolve(worktreePath, '.claude/state');
    mkdirSync(worktreePlansDir, { recursive: true });
    mkdirSync(worktreeStateDir, { recursive: true });

    // Copy plan file into worktree (since it's gitignored, it won't be there)
    const worktreePlanPath = resolve(worktreePath, planPath);
    writeFileSync(worktreePlanPath, planContent);

    // Copy .env file into worktree (gitignored, won't be there)
    if (envContent) {
      const worktreeEnvPath = resolve(worktreePath, '.env');
      writeFileSync(worktreeEnvPath, envContent);
    }

    // Install dependencies with silent output
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
      // Continue anyway - worktree is still usable
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
}

main();
