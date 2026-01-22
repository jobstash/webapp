import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { State } from './types.ts';

/**
 * Creates an empty state with optional feature name.
 */
export const createEmptyState = (feature = ''): State => ({
  feature,
  completed: [],
  failed: [],
  outputs: {},
  lastRun: new Date().toISOString(),
});

/**
 * Loads state from a file path.
 * Returns empty state if file doesn't exist.
 */
export const loadState = async (
  path: string | undefined,
  feature = '',
): Promise<State> => {
  if (!path) return createEmptyState(feature);

  try {
    const content = await readFile(path, 'utf-8');
    return JSON.parse(content);
  } catch {
    return createEmptyState(feature);
  }
};

/**
 * Saves state to a file path.
 * Creates parent directories if they don't exist.
 */
export const saveState = async (path: string, state: State): Promise<void> => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(state, null, 2));
};
