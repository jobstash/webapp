export type AgentType = 'react-architect' | 'react-qa' | 'manual';

export interface Task {
  id: string;
  title: string;
  agent: AgentType;
  dependsOn: string[];
  inputs: {
    files: string[];
    context: string | null;
  };
  outputs: {
    files: string[];
    exports: string[];
  };
  prompt: string;
}

export interface Plan {
  feature: string;
  created: string;
  status: string;
  overview: string;
  tasks: Task[];
}

export interface State {
  feature: string;
  completed: string[];
  failed: string[];
  outputs: Record<string, { files: string[]; exports: string[] }>;
  lastRun: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  taskCount?: number;
}

export interface NextTasksResult {
  ready: Task[];
  completed: string[];
  failed: string[];
  blocked: { id: string; waiting: string[] }[];
  done: boolean;
}

export interface CleanupResult {
  success: boolean;
  feature: string;
  summary: {
    total: number;
    completed: number;
    failed: number;
    pending: number;
  };
  deleted: {
    plan: boolean;
    state: boolean;
  };
  errors: string[];
}
