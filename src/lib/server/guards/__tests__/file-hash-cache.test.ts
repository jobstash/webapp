import { afterEach, describe, expect, it } from 'vitest';

import {
  _getCacheSize,
  _resetFileHashCache,
  computeFileHash,
  getCachedResult,
  setCachedResult,
} from '../file-hash-cache';

describe('file hash cache', () => {
  afterEach(() => {
    _resetFileHashCache();
  });

  it('computes consistent SHA-256 hashes', () => {
    const buffer = new TextEncoder().encode('hello world').buffer;
    const hash1 = computeFileHash(buffer);
    const hash2 = computeFileHash(buffer);
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex digest
  });

  it('returns null for cache miss', () => {
    expect(getCachedResult('nonexistent')).toBeNull();
  });

  it('stores and retrieves cached results', async () => {
    const response = Response.json({ skills: ['typescript'] });
    setCachedResult('abc123', response);

    const cached = getCachedResult('abc123');
    expect(cached).not.toBeNull();
    const body = await cached!.json();
    expect(body.skills).toEqual(['typescript']);
  });

  it('returns cloned responses (not the same reference)', () => {
    const response = Response.json({ data: 'test' });
    setCachedResult('hash1', response);

    const result1 = getCachedResult('hash1');
    const result2 = getCachedResult('hash1');
    expect(result1).not.toBe(result2);
  });

  it('evicts oldest entry when exceeding max entries', () => {
    for (let i = 0; i < 100; i++) {
      setCachedResult(`hash-${i}`, Response.json({ i }));
    }
    expect(_getCacheSize()).toBe(100);

    // Add one more, should evict hash-0
    setCachedResult('hash-100', Response.json({ i: 100 }));
    expect(_getCacheSize()).toBe(100);
    expect(getCachedResult('hash-0')).toBeNull();
    expect(getCachedResult('hash-100')).not.toBeNull();
  });

  it('refreshes LRU position on read', () => {
    for (let i = 0; i < 100; i++) {
      setCachedResult(`hash-${i}`, Response.json({ i }));
    }

    // Access hash-0 to refresh it
    getCachedResult('hash-0');

    // Add a new entry, should evict hash-1 (now the oldest)
    setCachedResult('hash-100', Response.json({ i: 100 }));
    expect(getCachedResult('hash-0')).not.toBeNull();
    expect(getCachedResult('hash-1')).toBeNull();
  });
});
