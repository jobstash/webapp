import { describe, expect, it, vi } from 'vitest';

import { checkOrigin } from '../origin-guard';

const FRONTEND_URL = 'https://jobstash.xyz';

vi.mock('@/lib/env/client', () => ({
  clientEnv: { FRONTEND_URL: 'https://jobstash.xyz' },
}));

const makeRequest = (headers: Record<string, string> = {}): Request =>
  new Request('https://jobstash.xyz/api/test', { headers });

describe('checkOrigin', () => {
  it('allows matching origin', () => {
    const result = checkOrigin(makeRequest({ origin: FRONTEND_URL }));
    expect(result).toBeNull();
  });

  it('allows matching referer when origin is absent', () => {
    const result = checkOrigin(
      makeRequest({ referer: `${FRONTEND_URL}/onboarding` }),
    );
    expect(result).toBeNull();
  });

  it('allows requests with no origin and no referer', () => {
    const result = checkOrigin(makeRequest());
    expect(result).toBeNull();
  });

  it('rejects mismatched origin', () => {
    const result = checkOrigin(makeRequest({ origin: 'https://evil.com' }));
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });

  it('rejects mismatched referer', () => {
    const result = checkOrigin(
      makeRequest({ referer: 'https://evil.com/page' }),
    );
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });

  it('prefers origin over referer', () => {
    const result = checkOrigin(
      makeRequest({
        origin: FRONTEND_URL,
        referer: 'https://evil.com/page',
      }),
    );
    expect(result).toBeNull();
  });
});
