// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  SearchToolsProvider,
  SearchToolsSlot,
} from '@/components/app-header/search-tools';
import { JobListToolbar } from './job-list-toolbar';

afterEach(cleanup);
describe('JobListToolbar', () => {
  it('places the page filters inside the header search bar and removes them on navigation', () => {
    const Page = ({ hasFeed }: { hasFeed: boolean }) => (
      <SearchToolsProvider>
        <header data-testid='search-bar'>
          <SearchToolsSlot />
        </header>
        {hasFeed && (
          <main>
            <JobListToolbar>
              <button>Filters</button>
            </JobListToolbar>
          </main>
        )}
      </SearchToolsProvider>
    );
    const { rerender } = render(<Page hasFeed />);
    expect(screen.getByTestId('search-bar')).toContainElement(
      screen.getByRole('button', { name: 'Filters' }),
    );
    rerender(<Page hasFeed={false} />);
    expect(
      screen.queryByRole('button', { name: 'Filters' }),
    ).not.toBeInTheDocument();
  });
});
