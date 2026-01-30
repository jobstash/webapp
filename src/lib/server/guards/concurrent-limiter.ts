import type { GuardResult } from './types';
import { guardError } from './types';

const MAX_CONCURRENT = 2;

const inFlight = new Map<string, number>();

export const acquireConcurrentSlot = (ip: string): GuardResult => {
  const current = inFlight.get(ip) ?? 0;

  if (current >= MAX_CONCURRENT) {
    return guardError(
      'Too many concurrent uploads. Please wait for current uploads to finish.',
      429,
    );
  }

  inFlight.set(ip, current + 1);
  return null;
};

export const releaseConcurrentSlot = (ip: string): void => {
  const current = inFlight.get(ip) ?? 0;
  if (current <= 1) {
    inFlight.delete(ip);
  } else {
    inFlight.set(ip, current - 1);
  }
};

/** Exposed for testing only */
export const _resetConcurrentLimiter = (): void => {
  inFlight.clear();
};
