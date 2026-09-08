// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/auth/hooks/use-session', () => ({
  useSession: () => ({ isSessionReady: true }),
}));
vi.mock('@privy-io/react-auth', () => ({
  usePrivy: () => ({ user: { id: 'fixture-user' } }),
}));

import { TalentPoolSetting } from './talent-pool-setting';

const fetchMock = vi.fn();
const renderSetting = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, throwOnError: true },
      mutations: { retry: false, throwOnError: true },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <TalentPoolSetting />
    </QueryClientProvider>,
  );
};

describe('talent pool switch', () => {
  beforeEach(() => vi.stubGlobal('fetch', fetchMock));
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads the saved setting and persists joining and leaving across remounts', async () => {
    let saved = false;
    fetchMock.mockImplementation(async (_url, options) => {
      if (options?.method === 'POST')
        saved = JSON.parse(options.body).availability;
      return Response.json({ availableForWork: saved });
    });
    const first = renderSetting();
    const toggle = screen.getByRole('switch', {
      name: 'Open to opportunities',
    });
    await waitFor(() => expect(toggle).toBeEnabled());
    expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await waitFor(() => expect(toggle).toBeChecked());
    expect(saved).toBe(true);
    first.unmount();

    renderSetting();
    const reopened = screen.getByRole('switch', {
      name: 'Open to opportunities',
    });
    await waitFor(() => expect(reopened).toBeChecked());
    await userEvent.click(reopened);
    await waitFor(() => expect(reopened).not.toBeChecked());
    expect(saved).toBe(false);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Hidden from the talent pool',
    );
  });

  it('keeps the saved value when a write fails', async () => {
    fetchMock
      .mockResolvedValueOnce(Response.json({ availableForWork: false }))
      .mockResolvedValueOnce(new Response(null, { status: 502 }));
    renderSetting();
    const toggle = screen.getByRole('switch');
    await waitFor(() => expect(toggle).toBeEnabled());
    await userEvent.click(toggle);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Your change was not saved',
    );
    expect(toggle).not.toBeChecked();
  });

  it('disables writes while loading and recovers from a failed read', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 502 }))
      .mockResolvedValueOnce(Response.json({ availableForWork: true }));
    renderSetting();
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeDisabled();
    await screen.findByText('Could not load your talent pool setting.');
    expect(toggle).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(toggle).toBeChecked());
    expect(toggle).toBeEnabled();
  });

  it('prevents duplicate changes until the save completes', async () => {
    let finish!: (response: Response) => void;
    fetchMock
      .mockResolvedValueOnce(Response.json({ availableForWork: false }))
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      );
    renderSetting();
    const toggle = screen.getByRole('switch');
    await waitFor(() => expect(toggle).toBeEnabled());
    await userEvent.click(toggle);
    expect(toggle).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('Saving');
    finish(Response.json({ availableForWork: true }));
    await waitFor(() => expect(toggle).toBeChecked());
    expect(toggle).toBeEnabled();
  });
});
