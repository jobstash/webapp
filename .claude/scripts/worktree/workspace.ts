/**
 * Manages VS Code workspace entries for worktrees.
 *
 * These functions add/remove worktree folders from the .code-workspace file
 * so VS Code's TypeScript language server recognizes them as separate projects.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';

interface WorkspaceFolder {
  path: string;
  name: string;
}

interface WorkspaceConfig {
  folders: WorkspaceFolder[];
  settings?: Record<string, unknown>;
}

function getWorkspacePath(projectRoot: string): string {
  const projectName = basename(projectRoot);
  return resolve(projectRoot, `../${projectName}.code-workspace`);
}

/**
 * Strips trailing commas from JSON to support JSONC format.
 *
 * Why this is needed:
 * - VS Code saves .code-workspace files in JSONC format (JSON with Comments)
 * - JSONC allows trailing commas (e.g., `{"a": 1,}`)
 * - JSON.parse() doesn't support trailing commas and throws an error
 * - We always write standard JSON with JSON.stringify(), but need to read JSONC
 *
 * Alternative: Use `jsonc-parser` package for full JSONC support.
 */
function stripJsonTrailingCommas(json: string): string {
  return json.replace(/,(\s*[}\]])/g, '$1');
}

function readWorkspace(
  workspacePath: string,
  projectName: string,
): WorkspaceConfig {
  if (!existsSync(workspacePath)) {
    // Create default workspace with just the main project
    // Use project name as path since workspace is in parent directory
    return {
      folders: [{ path: projectName, name: 'main' }],
      settings: {
        'typescript.tsdk': 'node_modules/typescript/lib',
      },
    };
  }

  return JSON.parse(
    stripJsonTrailingCommas(readFileSync(workspacePath, 'utf-8')),
  );
}

function writeWorkspace(workspacePath: string, config: WorkspaceConfig): void {
  writeFileSync(workspacePath, JSON.stringify(config, null, 2) + '\n');
}

/**
 * Adds a worktree to the VS Code workspace file.
 * Creates the workspace file if it doesn't exist.
 */
export function addWorktreeToWorkspace(
  projectRoot: string,
  worktreeName: string,
): void {
  const projectName = basename(projectRoot);
  const workspacePath = getWorkspacePath(projectRoot);
  const config = readWorkspace(workspacePath, projectName);

  // Worktree is a sibling folder: <projectName>-<worktreeName>
  const worktreePath = `${projectName}-${worktreeName}`;
  const folderName = `worktree:${worktreeName}`;

  // Check if already added
  const exists = config.folders.some((f) => f.path === worktreePath);
  if (exists) {
    return;
  }

  // Add the worktree folder
  config.folders.push({
    path: worktreePath,
    name: folderName,
  });

  writeWorkspace(workspacePath, config);
}

/**
 * Removes a worktree from the VS Code workspace file.
 */
export function removeWorktreeFromWorkspace(
  projectRoot: string,
  worktreeName: string,
): void {
  const projectName = basename(projectRoot);
  const workspacePath = getWorkspacePath(projectRoot);

  if (!existsSync(workspacePath)) {
    return;
  }

  const config = readWorkspace(workspacePath, projectName);
  // Worktree is a sibling folder: <projectName>-<worktreeName>
  const worktreePath = `${projectName}-${worktreeName}`;

  // Filter out the worktree
  config.folders = config.folders.filter((f) => f.path !== worktreePath);

  writeWorkspace(workspacePath, config);
}
