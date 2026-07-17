import { describe, expect, it, vi } from 'vitest';

import { fetchJobDetailsStaticParams } from './fetch-job-details-static-params';

const { mockFetchJobListPage } = vi.hoisted(() => ({
  mockFetchJobListPage: vi.fn(),
}));

vi.mock('./fetch-job-list-page', () => ({
  fetchJobListPage: mockFetchJobListPage,
}));

describe('fetchJobDetailsStaticParams', () => {
  it('uses the canonical href slug, including the organization', async () => {
    mockFetchJobListPage.mockResolvedValue({
      data: [
        {
          id: 'OYJ9hV',
          href: '/data-analyst-acquisition-tangem/OYJ9hV',
          title: 'Data Analyst (Acquisition)',
        },
      ],
    });

    await expect(fetchJobDetailsStaticParams()).resolves.toEqual([
      { id: 'OYJ9hV', slug: 'data-analyst-acquisition-tangem' },
    ]);
  });
});
