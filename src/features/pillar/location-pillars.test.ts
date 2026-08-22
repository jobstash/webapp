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
    expect(isValidPillarSlug('ct-utc-08')).toBe(true);
    expect(getPillarCategory('l-zurich')).toBe('location');
    expect(getPillarCategory('tz-europe-zurich')).toBe('timezone');
    expect(getPillarCategory('lt-remote')).toBe('locationType');
    expect(getPillarCategory('ct-utc-08')).toBe('collaborationHours');
  });

  it('keeps geographic and timezone pillars server-resolved', () => {
    expect(getPillarFilterContext('l-zurich')).toBeNull();
    expect(getPillarFilterContext('tz-europe-zurich')).toBeNull();
    expect(getPillarFilterContext('lt-remote')).toEqual({
      paramKey: 'workModes',
      value: 'remote',
    });
    expect(getPillarFilterContext('ct-utc-08')).toEqual({
      paramKey: 'collaborationHours',
      value: 'utc-08',
    });
  });

  it('builds a timezone-specific headline', () => {
    expect(getPillarHeadline('tz-europe-zurich')).toBe('Jobs in Europe Zurich');
  });

  it('builds a plain-language collaboration-hour headline', () => {
    expect(getPillarHeadline('ct-utc-08')).toBe('08:00 UTC Collaboration Jobs');
  });
});
