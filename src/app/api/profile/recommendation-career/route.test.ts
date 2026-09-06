import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PATCH } from './route';
import { getSession } from '@/lib/server/session';

vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://middleware.test' },
}));
vi.mock('@/lib/server/session', () => ({ getSession: vi.fn() }));

const request = (body: unknown) =>
  new Request('https://webapp.test/api/profile/recommendation-career', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
const career = { roles: [], educationLevel: null };

describe('career matching API', () => {
  beforeEach(() =>
    vi
      .mocked(getSession)
      .mockResolvedValue({ apiToken: 'session-token' } as never),
  );
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('requires an unexpired authenticated session', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    for (const session of [{}, { apiToken: 'expired', expiresAt: 1 }]) {
      vi.mocked(getSession).mockResolvedValue(session as never);
      expect((await PATCH(request(career))).status).toBe(401);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('validates bounded career data before forwarding', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect((await PATCH(request({ roles: Array(31).fill({}) }))).status).toBe(
      400,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('forwards only career fields using the authenticated account', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ success: true }));
    vi.stubGlobal('fetch', fetchMock);
    expect(
      (await PATCH(request({ ...career, wallet: 'another-user' }))).status,
    ).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://middleware.test/profile/recommendation-career',
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer session-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(career),
      }),
    );
  });
  it('handles a non-JSON upstream error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Bad gateway', { status: 502 })),
    );
    expect((await PATCH(request(career))).status).toBe(502);
  });
});
