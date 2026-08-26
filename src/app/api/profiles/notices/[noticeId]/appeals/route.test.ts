import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSession } from '@/lib/server/session';
import { POST } from './route';

vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://middleware.test' },
}));

vi.mock('@/lib/server/session', () => ({
  getSession: vi.fn(),
}));

const request = (body: unknown) =>
  new Request('https://jobstash.test/api/profiles/notices/notice-1/appeals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/profiles/notices/[noticeId]/appeals', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(getSession).mockResolvedValue({
      apiToken: 'session-token',
    } as never);
  });

  it('forwards an authenticated appeal without caching it', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        success: true,
        message: 'Appeal submitted for review',
        data: { id: 'appeal-1', status: 'pending' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(
      request({ appealText: 'This notice is incorrect.' }),
      {
        params: Promise.resolve({ noticeId: 'notice-1' }),
      },
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://middleware.test/profiles/notices/notice-1/appeals',
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
        headers: expect.objectContaining({
          Authorization: 'Bearer session-token',
        }),
      }),
    );
  });

  it('rejects short appeals before contacting middleware', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(request({ appealText: 'No.' }), {
      params: Promise.resolve({ noticeId: 'notice-1' }),
    });

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
