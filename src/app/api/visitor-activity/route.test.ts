import { describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
vi.mock('@/lib/env/client', () => ({
  clientEnv: { FRONTEND_URL: 'https://jobstash.xyz' },
}));
vi.mock('@/lib/server/visitor-activity', () => ({
  recordVisitorActivity: vi.fn().mockResolvedValue(undefined),
  setVisitorCookie: vi.fn(),
  visitorIdentity: vi.fn().mockReturnValue({ id: 'test' }),
  VISITOR_COOKIE: 'jobstash-visitor',
}));
import { POST } from './route';
describe('visitor presence behind the reverse proxy', () => {
  it('accepts the configured public origin when Next receives an internal URL', async () => {
    const req = new NextRequest('http://0.0.0.0:3000/api/visitor-activity', {
      method: 'POST',
      headers: {
        origin: 'https://jobstash.xyz',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ path: '/' }),
    });
    expect((await POST(req)).status).toBe(204);
  });
  it('rejects a different origin', async () => {
    const req = new NextRequest('http://0.0.0.0:3000/api/visitor-activity', {
      method: 'POST',
      headers: {
        origin: 'https://other.example',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ path: '/' }),
    });
    expect((await POST(req)).status).toBe(403);
  });
});
