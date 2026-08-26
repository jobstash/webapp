// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SearchResultsTabs } from './search-results-tabs';

afterEach(() => {
  cleanup();
});

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
  }) => (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const groups = [
  { id: 'jobs', label: 'Job Titles' },
  { id: 'classifications', label: 'Job Category' },
];

const commonProps = {
  query: 'technical clerk',
  groups,
  items: [],
  hasMore: false,
  isLoadingMore: false,
  onGroupChange: vi.fn(),
  onLoadMore: vi.fn(),
};

describe('SearchResultsTabs', () => {
  it('lets the Job Titles tab open the complete free-text result set', () => {
    render(<SearchResultsTabs {...commonProps} activeGroup='jobs' />);

    expect(
      screen.getByRole('link', {
        name: 'View all jobs matching “technical clerk”',
      }),
    ).toHaveAttribute('href', '/?titleQuery=technical%20clerk');
  });

  it('does not show the free-text result action in Job Category', () => {
    render(
      <SearchResultsTabs {...commonProps} activeGroup='classifications' />,
    );

    expect(
      screen.queryByRole('link', { name: /View all jobs matching/ }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText('Job Category')).not.toHaveLength(0);
  });
});
