import { afterEach, describe, expect, it, vi } from 'vitest';

import { _resetRateLimiter, checkRateLimit } from '../rate-limiter';

describe('checkRateLimit', () => {
  afterEach(() => {
    _resetRateLimiter();
    vi.useRealTimers();
  });

  it('allows requests under the limit', () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit('1.2.3.4')).toBeNull();
    }
  });

  it('rejects the 6th request within the window', () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit('1.2.3.4');
    }
    const result = checkRateLimit('1.2.3.4');
    expect(result).not.toBeNull();
    expect(result!.status).toBe(429);
  });

  it('includes Retry-After header', async () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit('1.2.3.4');
    }
    const result = checkRateLimit('1.2.3.4');
    expect(result!.headers.get('Retry-After')).toBeTruthy();
  });

  it('tracks IPs independently', () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit('1.1.1.1');
    }
    // Different IP should still be allowed
    expect(checkRateLimit('2.2.2.2')).toBeNull();
  });

  it('allows requests after the window expires', () => {
    vi.useFakeTimers();

    for (let i = 0; i < 5; i++) {
      checkRateLimit('1.2.3.4');
    }
    expect(checkRateLimit('1.2.3.4')).not.toBeNull();

    // Advance past the 15-minute window
    vi.advanceTimersByTime(15 * 60 * 1000 + 1);

    expect(checkRateLimit('1.2.3.4')).toBeNull();
  });
});
