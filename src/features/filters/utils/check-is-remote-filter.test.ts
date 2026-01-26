// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

// Mock the constants module to avoid clientEnv validation
vi.mock('@/features/filters/constants', () => ({
  REMOTE_FILTERS_SET: new Set(['tags']),
}));

import { checkIsRemoteFilter } from './check-is-remote-filter';

describe('checkIsRemoteFilter', () => {
  it('returns true for known remote filter key "tags"', () => {
    expect(checkIsRemoteFilter('tags')).toBe(true);
  });

  it('returns false for non-remote filter key', () => {
    expect(checkIsRemoteFilter('seniority')).toBe(false);
    expect(checkIsRemoteFilter('locations')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(checkIsRemoteFilter('')).toBe(false);
  });
});
