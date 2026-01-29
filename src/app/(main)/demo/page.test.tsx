// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import DemoPage from './page';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockPost = {
  userId: 1,
  id: 1,
  title: 'Test Post Title',
  body: 'Test post body content',
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe('DemoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Initial State', () => {
    it('renders heading and button', () => {
      renderWithClient(<DemoPage />);

      expect(screen.getByText('Demo Page')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Load Data' })).toBeEnabled();
    });

    it('displays placeholder text with muted styling', () => {
      renderWithClient(<DemoPage />);

      const pre = screen.getByText('Click button to load data').closest('pre');
      expect(pre).toHaveClass('text-muted-foreground');
    });

    it('does not fetch data on mount', () => {
      renderWithClient(<DemoPage />);

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Layout', () => {
    it('renders with correct container styling', () => {
      renderWithClient(<DemoPage />);

      const container = screen.getByText('Demo Page').parentElement;
      expect(container).toHaveClass(
        'flex',
        'min-h-screen',
        'flex-col',
        'items-center',
        'gap-6',
        'p-8',
      );
    });

    it('renders pre element with correct styling', () => {
      renderWithClient(<DemoPage />);

      const pre = screen.getByText('Click button to load data').closest('pre');
      expect(pre).toHaveClass(
        'w-full',
        'max-w-2xl',
        'rounded-lg',
        'border',
        'bg-card',
        'p-6',
        'text-sm',
      );
    });
  });

  describe('Data Fetching', () => {
    it('fetches data when button is clicked', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPost),
      });

      const user = userEvent.setup();
      renderWithClient(<DemoPage />);

      await user.click(screen.getByRole('button', { name: 'Load Data' }));

      expect(mockFetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/posts/1',
      );
    });

    it('shows loading state while fetching', async () => {
      let resolvePromise: (value: unknown) => void;
      const fetchPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockFetch.mockReturnValueOnce({
        ok: true,
        json: () => fetchPromise,
      });

      const user = userEvent.setup();
      renderWithClient(<DemoPage />);

      await user.click(screen.getByRole('button', { name: 'Load Data' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Loading...' }),
        ).toBeDisabled();
      });
      expect(screen.getByText('Loading data...')).toBeInTheDocument();

      resolvePromise!(mockPost);
    });

    it('displays JSON data on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPost),
      });

      const user = userEvent.setup();
      renderWithClient(<DemoPage />);

      await user.click(screen.getByRole('button', { name: 'Load Data' }));

      await waitFor(() => {
        expect(
          screen.getByText(/"title": "Test Post Title"/),
        ).toBeInTheDocument();
      });
      expect(screen.getByRole('button', { name: 'Load Data' })).toBeEnabled();
    });

    it('displays error message on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const user = userEvent.setup();
      renderWithClient(<DemoPage />);

      await user.click(screen.getByRole('button', { name: 'Load Data' }));

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
      });
    });
  });
});
