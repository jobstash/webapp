import { describe, expect, it } from 'vitest';

import {
  getPillarCategory,
  getPillarFilterContext,
  getPillarHeadline,
  isValidPillarSlug,
} from './constants';

describe('location pillars', () => {
  it('recognizes geographic, timezone, and work-mode pillars separately', () => {
    expect(isValidPillarSlug('l-zurich')).toBe(true);
    expect(isValidPillarSlug('tz-europe-zurich')).toBe(true);
    expect(isValidPillarSlug('lt-remote')).toBe(true);
    expect(getPillarCategory('l-zurich')).toBe('location');
    expect(getPillarCategory('tz-europe-zurich')).toBe('timezone');
    expect(getPillarCategory('lt-remote')).toBe('locationType');
  });

  it('keeps geographic and timezone pillars server-resolved', () => {
    expect(getPillarFilterContext('l-zurich')).toBeNull();
    expect(getPillarFilterContext('tz-europe-zurich')).toBeNull();
    expect(getPillarFilterContext('lt-remote')).toEqual({
      paramKey: 'workModes',
      value: 'remote',
    });
  });

  it('builds a timezone-specific headline', () => {
    expect(getPillarHeadline('tz-europe-zurich')).toBe('Jobs in Europe Zurich');
  });
});
