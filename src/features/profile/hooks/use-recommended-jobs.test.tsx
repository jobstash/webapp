// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  useDismissRecommendedJob,
  useRecommendedJobs,
} from './use-recommended-jobs';

const setup = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
};

describe('recommendation pages', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('fetches and caches the requested page independently', async () => {
    const rankedAt = '2026-09-07T10:00:00.000Z';
    const fetch = vi.fn().mockResolvedValue(
      Response.json({
        jobs: [],
        total: 61,
        page: 2,
        hasMore: true,
        rankedAt,
      }),
    );
    vi.stubGlobal('fetch', fetch);
    const { client, wrapper } = setup();
    const { result } = renderHook(() => useRecommendedJobs(2, rankedAt), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetch).toHaveBeenCalledWith(
      `/api/jobs/recommended?page=2&rankedAt=${encodeURIComponent(rankedAt)}`,
      {
        cache: 'no-store',
      },
    );
    expect(
      client.getQueryData(['recommended-jobs', 2, rankedAt]),
    ).toMatchObject({
      total: 61,
      page: 2,
      hasMore: true,
      rankedAt,
    });
    expect(client.getQueryData(['recommended-jobs', 1])).toBeUndefined();
    client.clear();
  });

  it('removes a hidden job and refreshes every cached page without losing the full count', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );
    const { client, wrapper } = setup();
    client.setQueryData(['recommended-jobs', 1], {
      jobs: [{ job: { id: 'a' } }, { job: { id: 'b' } }],
      total: 31,
      page: 1,
      hasMore: true,
    });
    client.setQueryData(['recommended-jobs', 2], {
      jobs: [{ job: { id: 'c' } }],
      total: 31,
      page: 2,
      hasMore: false,
    });
    const { result } = renderHook(() => useDismissRecommendedJob(), {
      wrapper,
    });
    await act(() => result.current.mutateAsync('a'));
    expect(client.getQueryData(['recommended-jobs', 1])).toMatchObject({
      jobs: [{ job: { id: 'b' } }],
      total: 30,
    });
    expect(client.getQueryData(['recommended-jobs', 2])).toMatchObject({
      jobs: [{ job: { id: 'c' } }],
      total: 30,
    });
    expect(client.getQueryState(['recommended-jobs', 1])?.isInvalidated).toBe(
      true,
    );
    expect(client.getQueryState(['recommended-jobs', 2])?.isInvalidated).toBe(
      true,
    );
    client.clear();
  });
});
