import { createHash } from 'node:crypto';

const MAX_ENTRIES = 100;

interface CacheEntry {
  result: Response;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

export const computeFileHash = (buffer: ArrayBuffer): string => {
  const hash = createHash('sha256');
  hash.update(Buffer.from(buffer));
  return hash.digest('hex');
};

export const getCachedResult = (hash: string): Response | null => {
  const entry = cache.get(hash);
  if (!entry) return null;

  // LRU: move to end by re-inserting
  cache.delete(hash);
  cache.set(hash, entry);

  return entry.result.clone();
};

export const setCachedResult = (hash: string, result: Response): void => {
  // Evict oldest entry if at capacity
  if (cache.size >= MAX_ENTRIES && !cache.has(hash)) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
    }
  }

  cache.set(hash, { result: result.clone(), timestamp: Date.now() });
};

/** Exposed for testing only */
export const _resetFileHashCache = (): void => {
  cache.clear();
};

/** Exposed for testing only */
export const _getCacheSize = (): number => cache.size;
