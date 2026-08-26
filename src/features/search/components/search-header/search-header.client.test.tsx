// @vitest-environment jsdom
import type { FormEvent, ReactNode } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SearchHeaderClient } from './search-header.client';

const push = vi.fn();
const trackEvent = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/lib/analytics', () => ({
  GA_EVENT: { SEARCH_QUERY: 'search_query' },
  trackEvent: (...args: unknown[]) => trackEvent(...args),
}));

vi.mock('./use-search-suggestions', () => ({
  useSearchSuggestions: () => ({
    availableGroups: [],
    activeGroup: '',
    items: [],
    hasMore: false,
    isLoading: false,
    isLoadingMore: false,
    onGroupChange: vi.fn(),
    loadMore: vi.fn(),
  }),
}));

vi.mock('./search-suggestions', () => ({
  SearchSuggestions: () => <div>Search suggestions</div>,
}));

vi.mock('./search-overlay', () => ({
  SearchOverlay: ({
    open,
    query,
    onQueryChange,
    onSubmit,
  }: {
    open: boolean;
    query: string;
    onQueryChange: (value: string) => void;
    onSubmit: () => void;
    children?: ReactNode;
  }) =>
    open ? (
      <form
        aria-label='Mobile job title search'
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <input
          aria-label='Mobile search query'
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </form>
    ) : null,
}));

afterEach(() => {
  cleanup();
  push.mockClear();
  trackEvent.mockClear();
});

describe('SearchHeaderClient', () => {
  it('submits the desktop value as a job-title search when Enter is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchHeaderClient />);

    const desktopInput = screen.getAllByPlaceholderText('Search...')[0];
    await user.type(desktopInput, '  engineering manager  ');
    await user.keyboard('{Enter}');

    expect(push).toHaveBeenCalledWith('/?titleQuery=engineering%20manager');
    expect(trackEvent).toHaveBeenCalledWith('search_query', {
      search_query: 'engineering manager',
    });
    expect(screen.queryByText('Search suggestions')).not.toBeInTheDocument();
  });

  it('submits the mobile value as the same job-title search', async () => {
    const user = userEvent.setup();
    render(<SearchHeaderClient />);

    await user.click(screen.getByRole('button', { name: 'Open search' }));
    const mobileInput = screen.getByRole('textbox', {
      name: 'Mobile search query',
    });
    await user.type(mobileInput, 'protocol engineer');
    fireEvent.submit(
      screen.getByRole('form', { name: 'Mobile job title search' }),
    );

    expect(push).toHaveBeenCalledWith('/?titleQuery=protocol%20engineer');
  });
});
