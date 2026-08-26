// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { JobListToolbar } from './job-list-toolbar';

afterEach(cleanup);

describe('JobListToolbar', () => {
  it('keeps the filter trigger inline with the mobile result count', () => {
    render(
      <JobListToolbar total={1_234}>
        <button type='button'>Filters</button>
      </JobListToolbar>,
    );

    const toolbar = screen.getByTestId('mobile-job-list-toolbar');
    const trigger = screen.getByRole('button', { name: 'Filters' });

    expect(toolbar).toHaveClass('flex', 'justify-between', 'lg:hidden');
    expect(toolbar).toHaveTextContent('1,234 open jobs');
    expect(trigger.closest('[data-testid="mobile-job-list-toolbar"]')).toBe(
      toolbar,
    );
  });

  it('shows the loading and singular result states', () => {
    const { rerender } = render(<JobListToolbar />);
    expect(screen.getByText('Loading jobs…')).toBeInTheDocument();

    rerender(<JobListToolbar total={1} />);
    expect(screen.getByTestId('mobile-job-list-toolbar')).toHaveTextContent(
      '1 open job',
    );
  });
});
