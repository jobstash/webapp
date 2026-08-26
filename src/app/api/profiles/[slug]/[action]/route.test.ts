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
  new Request('https://jobstash.test/api/profiles/acme/cases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

const context = (action: string) => ({
  params: Promise.resolve({ slug: 'acme', action }),
});

describe('POST /api/profiles/[slug]/[action]', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(getSession).mockResolvedValue({
      apiToken: 'session-token',
    } as never);
  });

  it('keeps recruiter reports authenticated and forwards the exact validated payload', async () => {
    const report = {
      childId: 'organization-1',
      allegation: {
        category: 'impersonation',
        recruiterContact: '@fake-recruiter',
        evidenceUrl: 'https://example.test/evidence',
        details:
          'The account used the company name and requested wallet credentials.',
      },
    };
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        success: true,
        message: 'Recruiter case submitted for review',
        data: { id: 'case-1', status: 'pending' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(request(report), context('cases'));

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://middleware.test/profiles/acme/cases',
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
        headers: expect.objectContaining({
          Authorization: 'Bearer session-token',
        }),
        body: JSON.stringify(report),
      }),
    );
  });

  it('rejects unauthenticated reports before contacting middleware', async () => {
    vi.mocked(getSession).mockResolvedValue({ apiToken: null } as never);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(request({}), context('cases'));

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not allow arbitrary actions through the proxy', async () => {
    const response = await POST(request({}), context('notices'));

    expect(response.status).toBe(404);
  });
});
