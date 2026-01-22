/**
 * Shared types for worktree scripts.
 */

export interface WorktreeMetadata {
  feature: string;
  plan: string;
  baseBranch: string;
  branchName: string;
  createdAt: string;
  projectRoot: string;
}

export interface FileChange {
  status: string; // A, M, D, R
  path: string;
  category: string;
}

export interface CommitGroup {
  category: string;
  message: string;
  files: string[];
}

export interface AnalyzeResult {
  success: boolean;
  metadata?: WorktreeMetadata;
  changes?: FileChange[];
  commitGroups?: CommitGroup[];
  error?: string;
}

export interface CommitResult {
  success: boolean;
  commits?: string[];
  error?: string;
}

export interface CleanupResult {
  success: boolean;
  cleanedUp?: boolean;
  error?: string;
}

export interface SetupResult {
  success: boolean;
  worktreePath?: string;
  metadata?: WorktreeMetadata;
  error?: string;
  alreadyExists?: boolean;
}
