import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock('@/lib/server/session', () => ({ getSession }));
vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://middleware.test' },
}));

import { GET, POST } from './route';

const fetchMock = vi.fn();
const request = (body: unknown) =>
  new Request('https://jobstash.test/api/profile/availability', {
    method: 'POST',
    body: JSON.stringify(body),
  });

describe('profile availability', () => {
  beforeEach(() => {
    getSession.mockResolvedValue({ apiToken: 'fixture-token' });
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  it('requires authentication for reads and writes', async () => {
    getSession.mockResolvedValue({});
    expect((await GET()).status).toBe(401);
    expect((await POST(request({ availability: true }))).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns only the current user’s saved availability', async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        success: true,
        data: { availableForWork: true, email: 'private@example.test' },
      }),
    );
    expect(await (await GET()).json()).toEqual({ availableForWork: true });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://middleware.test/profile/info',
      expect.objectContaining({
        headers: { Authorization: 'Bearer fixture-token' },
        cache: 'no-store',
      }),
    );
  });

  it.each([true, false])(
    'saves explicit availability %s through the existing endpoint',
    async (availability) => {
      fetchMock.mockResolvedValue(Response.json({ success: true }));
      const result = await POST(request({ availability }));
      expect(result.status).toBe(200);
      expect(await result.json()).toEqual({ availableForWork: availability });
      expect(fetchMock).toHaveBeenCalledWith(
        'https://middleware.test/profile/availability',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ availability }),
          headers: {
            Authorization: 'Bearer fixture-token',
            'Content-Type': 'application/json',
          },
        }),
      );
    },
  );

  it.each([
    { availability: 'false' },
    {},
    { availability: true, wallet: 'another-user' },
  ])('rejects invalid or foreign-user payloads: %j', async (payload) => {
    expect((await POST(request(payload))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not report success when the middleware rejects the update with HTTP 200', async () => {
    fetchMock.mockResolvedValue(
      Response.json({ success: false, message: 'User not found' }),
    );
    expect((await POST(request({ availability: true }))).status).toBe(502);
  });

  it('does not turn an unreadable profile into an opt-out', async () => {
    fetchMock.mockResolvedValue(Response.json({ success: true, data: {} }));
    expect((await GET()).status).toBe(502);
  });

  it('preserves authentication failures and handles network failures', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockRejectedValueOnce(new Error('offline'));
    expect((await GET()).status).toBe(401);
    expect((await POST(request({ availability: false }))).status).toBe(502);
  });
});
