// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { JobListItemSchema } from '@/features/jobs/schemas';
import { JobStack } from './job-stack';
import { getPageHref } from './job-list-pagination';

vi.mock('./job-list-item', () => ({
  JobListItem: ({
    job,
    footer,
  }: {
    job: JobListItemSchema;
    footer: React.ReactNode;
  }) => (
    <article>
      <h2>{job.title}</h2>
      {footer}
    </article>
  ),
}));
vi.mock('@/components/link-with-loader', () => ({
  LinkWithLoader: ({ children, ...props }: React.ComponentProps<'a'>) => (
    <a {...props}>{children}</a>
  ),
}));
vi.mock('@/lib/analytics', () => ({ GA_EVENT: {}, trackEvent: vi.fn() }));
afterEach(cleanup);
const jobs = Array.from(
  { length: 5 },
  (_, index) =>
    ({
      id: String(index),
      title: `Engineer ${index}`,
      organization: { name: 'Acme', href: '/o-acme~org-acme' },
    }) as JobListItemSchema,
);

describe('organization card stack', () => {
  it('mounts one card, pages locally, and links to all organization jobs', () => {
    const { container } = render(<JobStack jobs={jobs} />);
    expect(container.querySelectorAll('article')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Previous job' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next job' }));
    expect(screen.getByRole('heading').textContent).toBe('Engineer 1');
    expect(screen.getByRole('status').textContent).toBe('2 of 5');
    fireEvent.click(screen.getByRole('button', { name: 'Show job 5 of 5' }));
    expect(screen.getByRole('button', { name: 'Next job' })).toBeDisabled();
    expect(screen.getByRole('link').getAttribute('href')).toBe(
      '/o-acme~org-acme',
    );
  });
  it('preserves the selected job after refresh, then falls back when it disappears', () => {
    const view = render(<JobStack jobs={jobs} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next job' }));
    view.rerender(<JobStack jobs={[jobs[4], ...jobs.slice(0, 4)]} />);
    expect(screen.getByRole('heading').textContent).toBe('Engineer 1');
    view.rerender(<JobStack jobs={[jobs[4], jobs[3]]} />);
    expect(screen.getByRole('heading').textContent).toBe('Engineer 4');
    view.rerender(<JobStack jobs={jobs} />);
    expect(screen.getByRole('heading').textContent).toBe('Engineer 4');
  });
  it('omits pager and layers for a single job', () => {
    const { container } = render(<JobStack jobs={[jobs[0]]} />);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(container.querySelector('div[aria-hidden="true"]')).toBeNull();
    expect(screen.getByRole('link')).toBeTruthy();
  });
  it('keeps pillar paths and filters across pages', () => {
    expect(
      getPageHref(2, { workModes: 'remote', page: '1' }, '/lt-fully-remote'),
    ).toBe('/lt-fully-remote?page=2&workModes=remote');
    expect(getPageHref(1, {}, '/o-acme~org-acme')).toBe('/o-acme~org-acme');
  });
});
