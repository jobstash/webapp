import { afterEach, describe, expect, it, vi } from 'vitest';

import { PATCH } from './route';

vi.mock('@/lib/env/client', () => ({
  clientEnv: { MW_URL: 'https://middleware.test' },
}));

vi.mock('@/lib/server/session', () => ({
  getSession: vi.fn().mockResolvedValue({ apiToken: 'session-token' }),
}));

const preferences = {
  workModes: ['remote'],
  residenceCountry: 'NL',
  utcOffset: 5.75,
  workAuthorization: 'EU',
  requiresSponsorship: false,
  attendancePreference: 'Remote only',
  travelTolerance: 'Once per quarter',
};

const request = (body: unknown) =>
  new Request('https://webapp.test/api/profile/job-preferences', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('PATCH /api/profile/job-preferences', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('forwards only the seven canonical preference fields', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(preferences));
    vi.stubGlobal('fetch', fetchMock);

    const response = await PATCH(request(preferences));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(preferences);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://middleware.test/profile/job-preferences',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify(preferences),
      }),
    );
  });

  it.each([
    ['acceptableWorkModes', ['remote']],
    ['ianaTimezone', 'Europe/Amsterdam'],
    ['needsSponsorship', false],
  ])(
    'rejects removed alias %s before calling middleware',
    async (key, value) => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      const response = await PATCH(request({ ...preferences, [key]: value }));

      expect(response.status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
});
