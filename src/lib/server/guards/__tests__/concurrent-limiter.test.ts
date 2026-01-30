import { afterEach, describe, expect, it } from 'vitest';

import {
  _resetConcurrentLimiter,
  acquireConcurrentSlot,
  releaseConcurrentSlot,
} from '../concurrent-limiter';

describe('concurrent limiter', () => {
  afterEach(() => {
    _resetConcurrentLimiter();
  });

  it('allows up to 2 concurrent slots', () => {
    expect(acquireConcurrentSlot('1.2.3.4')).toBeNull();
    expect(acquireConcurrentSlot('1.2.3.4')).toBeNull();
  });

  it('rejects the 3rd concurrent request', () => {
    acquireConcurrentSlot('1.2.3.4');
    acquireConcurrentSlot('1.2.3.4');
    const result = acquireConcurrentSlot('1.2.3.4');
    expect(result).not.toBeNull();
    expect(result!.status).toBe(429);
  });

  it('allows new requests after releasing a slot', () => {
    acquireConcurrentSlot('1.2.3.4');
    acquireConcurrentSlot('1.2.3.4');
    releaseConcurrentSlot('1.2.3.4');
    expect(acquireConcurrentSlot('1.2.3.4')).toBeNull();
  });

  it('tracks IPs independently', () => {
    acquireConcurrentSlot('1.1.1.1');
    acquireConcurrentSlot('1.1.1.1');
    // Different IP should still be allowed
    expect(acquireConcurrentSlot('2.2.2.2')).toBeNull();
  });

  it('cleans up entry when count reaches 0', () => {
    acquireConcurrentSlot('1.2.3.4');
    releaseConcurrentSlot('1.2.3.4');
    // Should be able to acquire 2 more (entry was deleted)
    expect(acquireConcurrentSlot('1.2.3.4')).toBeNull();
    expect(acquireConcurrentSlot('1.2.3.4')).toBeNull();
  });
});
