import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://middleware.test' },
}));
import {
  recordVisitorActivity,
  visitorIdentity,
  visitorPath,
} from './visitor-activity';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe('visitor activity', () => {
  it('reuses only a valid signed browser identifier', () => {
    vi.stubEnv(
      'SESSION_SECRET',
      'test-session-secret-with-at-least-32-characters',
    );
    const first = visitorIdentity(undefined);
    expect(first.fresh).toBe(true);
    expect(visitorIdentity(first.cookie)).toMatchObject({
      id: first.id,
      fresh: false,
    });
    expect(
      visitorIdentity(
        first.cookie.replace(first.id, '11111111-1111-4111-8111-111111111111'),
      ).id,
    ).not.toBe('11111111-1111-4111-8111-111111111111');
  });
  it('does not keep search strings or private document paths', () => {
    expect(visitorPath('/jobs?token=secret')).toBe('/jobs');
    expect(visitorPath('/profile/career/private-document')).toBe('/profile');
    expect(visitorPath('/api/resume/private-id')).toBe('/profile');
  });
  it('does not trust arbitrary visitor IP or country headers by default', async () => {
    vi.stubEnv(
      'VISITOR_INGEST_SECRET',
      'test-ingest-secret-with-at-least-32-characters',
    );
    vi.stubEnv('VISITOR_TRUSTED_IP_HEADER', '');
    vi.stubEnv('VISITOR_TRUSTED_COUNTRY_HEADER', '');
    const fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetch);
    await recordVisitorActivity(
      new NextRequest('https://jobstash.xyz/jobs', {
        headers: { 'x-real-ip': '1.1.1.1', 'cf-ipcountry': 'SG' },
      }),
      visitorIdentity(undefined),
      'request',
      '/jobs',
    );
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.networkKey).toBeUndefined();
    expect(body.country).toBeUndefined();
    expect(fetch.mock.calls[0][1].headers['x-visitor-signature']).toMatch(
      /^[a-f0-9]{64}$/,
    );
  });
  it('does not throw or retry when collection is unavailable', async () => {
    vi.stubEnv(
      'VISITOR_INGEST_SECRET',
      'test-ingest-secret-with-at-least-32-characters',
    );
    const fetch = vi.fn().mockRejectedValue(new Error('unavailable'));
    vi.stubGlobal('fetch', fetch);
    await expect(
      recordVisitorActivity(
        new NextRequest('https://jobstash.xyz/'),
        visitorIdentity(undefined),
        'request',
        '/',
      ),
    ).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('does not count internal health checks as visitors', async () => {
    vi.stubEnv(
      'VISITOR_INGEST_SECRET',
      'test-ingest-secret-with-at-least-32-characters',
    );
    vi.stubEnv('VISITOR_TRUSTED_IP_HEADER', 'x-real-ip');
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    await recordVisitorActivity(
      new NextRequest('http://localhost:3000/'),
      visitorIdentity(undefined),
      'request',
      '/',
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it('forwards the raw address from the configured trusted proxy', async () => {
    vi.stubEnv(
      'VISITOR_INGEST_SECRET',
      'test-ingest-secret-with-at-least-32-characters',
    );
    vi.stubEnv('VISITOR_TRUSTED_IP_HEADER', 'x-real-ip');
    const fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetch);
    await recordVisitorActivity(
      new NextRequest('https://jobstash.xyz/', {
        headers: { 'x-real-ip': '2001:4860:4860::8888' },
      }),
      visitorIdentity(undefined),
      'request',
      '/',
    );
    expect(JSON.parse(fetch.mock.calls[0][1].body).ip).toBe(
      '2001:4860:4860::8888',
    );
  });
});
