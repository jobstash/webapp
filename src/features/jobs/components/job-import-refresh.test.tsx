// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { JobImportRefresh } from './job-import-refresh';

const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  refresh.mockClear();
});

it('refreshes an open list and recommendations only when completed job data changes', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(Response.json({ revision: 'before' })),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  client.setQueryData(['recommended-jobs', 1], { jobs: [] });
  render(
    <QueryClientProvider client={client}>
      <JobImportRefresh />
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(client.getQueryData(['jobs-revision'])).toBe('before'),
  );
  expect(refresh).not.toHaveBeenCalled();
  act(() => {
    client.setQueryData(['jobs-revision'], 'after');
  });
  await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
  expect(client.getQueryState(['recommended-jobs', 1])?.isInvalidated).toBe(
    true,
  );
  act(() => {
    client.setQueryData(['jobs-revision'], 'after');
  });
  expect(refresh).toHaveBeenCalledTimes(1);
  client.clear();
});
