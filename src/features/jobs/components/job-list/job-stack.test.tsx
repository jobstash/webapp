// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { JobListItemSchema } from '@/features/jobs/schemas';
import { jobTitles, makeJob } from '../../test/job-fixtures';
import { JobStack } from './job-stack';
import { getPageHref } from './job-list-pagination';

vi.mock('./job-list-item', () => ({
  JobListItemFrame: ({ children }: { children: React.ReactNode }) => (
    <article>{children}</article>
  ),
  JobListItem: ({ job }: { job: JobListItemSchema }) => (
    <>
      <h2>{job.title}</h2>
      {/* Plain anchor keeps this fixture independent of Next navigation. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href={job.href}>View details</a>
    </>
  ),
}));
vi.mock('@/components/link-with-loader', () => ({
  LinkWithLoader: ({ children, ...props }: React.ComponentProps<'a'>) => (
    <a {...props}>{children}</a>
  ),
}));

const clients: QueryClient[] = [];
const renderStack = (
  jobs: JobListItemSchema[],
  initialJobs = jobs,
  importRunId: string | null = 'run-1',
) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  clients.push(client);
  const props = { jobs: initialJobs, jobTitles: jobTitles(jobs), importRunId };
  const view = render(<JobStack {...props} />, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
  return { ...view, props, client };
};
const jobs = Array.from({ length: 5 }, (_, index) => makeJob(String(index)));
const swipe = (target: HTMLElement, dx: number, dy = 0) => {
  fireEvent.touchStart(target, { touches: [{ clientX: 200, clientY: 200 }] });
  fireEvent.touchEnd(target, {
    changedTouches: [{ clientX: 200 + dx, clientY: 200 + dy }],
  });
};

afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('organization card stack', () => {
  it('labels complete search results as matching jobs instead of new discoveries', () => {
    renderStack(jobs, jobs, null);
    expect(screen.getByRole('status')).toHaveTextContent('matching jobs');
    expect(screen.getByRole('status')).not.toHaveTextContent('new jobs found');
  });

  it('selects named jobs, mounts one card and links to the complete organization listing', () => {
    const { container } = renderStack(jobs);
    expect(screen.getAllByRole('tab')).toHaveLength(5);
    expect(screen.getByRole('button', { name: 'Previous job' })).toBeDisabled();
    fireEvent.click(screen.getByRole('tab', { name: 'Engineer 3' }));
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer 3');
    expect(screen.getByRole('status')).toHaveTextContent('4 of 5');
    expect(screen.getByRole('tab', { name: 'Engineer 3' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next job' }));
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer 4');
    expect(screen.getByRole('button', { name: 'Next job' })).toBeDisabled();
    expect(
      screen.getByRole('link', { name: 'All jobs at Acme' }),
    ).toHaveAttribute('href', '/o-acme~org-acme');
    expect(container.querySelectorAll('article')).toHaveLength(1);
  });

  it('preserves all 63 imported jobs and the selection when the title strip shrinks', () => {
    const observers = new Set<() => void>();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(private callback: () => void) {}
        observe() {
          observers.add(this.callback);
        }
        disconnect() {
          observers.delete(this.callback);
        }
      },
    );
    const batch = Array.from({ length: 63 }, (_, i) => makeJob(String(i)));
    const { container } = renderStack(batch);
    fireEvent.click(screen.getByRole('tab', { name: 'Engineer 62' }));
    const strip = screen.getByRole('tablist');
    vi.spyOn(strip, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      right: 160,
      width: 160,
    } as DOMRect);
    act(() => observers.forEach((callback) => callback()));
    expect(screen.getAllByRole('tab')).toHaveLength(63);
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer 62');
    expect(screen.getByRole('status')).toHaveTextContent('63 of 63');
    expect(screen.getByRole('button', { name: 'Next job' })).toBeDisabled();
    expect(container.querySelectorAll('article')).toHaveLength(1);
    expect(container.querySelectorAll('div[aria-hidden="true"]')).toHaveLength(
      3,
    );
  });

  it('uses location to distinguish duplicate titles before selection', () => {
    const duplicates = ['Amsterdam', 'Berlin'].map((location, index) => ({
      ...makeJob(String(index)),
      title: 'Staff Engineer',
      location,
    }));
    renderStack(duplicates);
    expect(
      screen.getByRole('tab', { name: 'Staff Engineer · Amsterdam' }),
    ).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(
      screen.getByRole('tab', { name: 'Staff Engineer · Berlin' }),
    );
    expect(
      screen.getByRole('tab', { name: 'Staff Engineer · Berlin' }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('2 of 2');
  });

  it('supports keyboard navigation and keeps focus on the selected title', () => {
    renderStack(jobs);
    const first = screen.getByRole('tab', { name: 'Engineer 0' });
    first.focus();
    fireEvent.keyDown(first, { key: 'End' });
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer 4');
    expect(screen.getByRole('tab', { name: 'Engineer 4' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer 3');
    expect(screen.getByRole('tab', { name: 'Engineer 3' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer 0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer 1');
    expect(
      screen.getAllByRole('tab').filter((tab) => tab.tabIndex === 0),
    ).toEqual([screen.getByRole('tab', { name: 'Engineer 1' })]);
  });

  it('preserves selected identity across refresh and falls back when that job leaves the batch', () => {
    const { rerender, props } = renderStack(jobs);
    fireEvent.click(screen.getByRole('tab', { name: 'Engineer 1' }));
    const reordered = [jobs[4], ...jobs.slice(0, 4)];
    rerender(
      <JobStack {...props} jobs={reordered} jobTitles={jobTitles(reordered)} />,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer 1');
    const nextBatch = [jobs[4], jobs[3]];
    rerender(
      <JobStack
        jobs={nextBatch}
        jobTitles={jobTitles(nextBatch)}
        importRunId='run-2'
      />,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer 4');
    expect(screen.getByRole('status')).toHaveTextContent('1 of 2');
  });

  it('omits paging and decorative layers for one job while keeping the organization link', () => {
    const { container } = renderStack([jobs[0]]);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(container.querySelector('div[aria-hidden="true"]')).toBeNull();
    expect(
      screen.getByRole('link', { name: 'All jobs at Acme' }),
    ).toBeVisible();
  });

  it('swipes cards without intercepting vertical scrolling, title scrolling or controls', () => {
    renderStack(jobs);
    swipe(screen.getByRole('heading'), -100);
    expect(screen.getByRole('status')).toHaveTextContent('2 of 5');
    swipe(screen.getByRole('heading'), -100, 150);
    swipe(screen.getByRole('link', { name: 'View details' }), -100);
    swipe(screen.getByRole('button', { name: 'Next job' }), -100);
    swipe(screen.getByRole('tablist'), -100);
    expect(screen.getByRole('status')).toHaveTextContent('2 of 5');
    swipe(screen.getByRole('heading'), 100);
    swipe(screen.getByRole('heading'), 100);
    expect(screen.getByRole('status')).toHaveTextContent('1 of 5');
    const card = screen.getByRole('heading');
    fireEvent.touchStart(card, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchCancel(card);
    fireEvent.touchEnd(card, {
      changedTouches: [{ clientX: 0, clientY: 200 }],
    });
    expect(screen.getByRole('status')).toHaveTextContent('1 of 5');
    fireEvent.touchStart(card, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchMove(card, {
      touches: [
        { clientX: 180, clientY: 200 },
        { clientX: 150, clientY: 200 },
      ],
    });
    fireEvent.touchEnd(card, {
      changedTouches: [{ clientX: 0, clientY: 200 }],
    });
    expect(screen.getByRole('status')).toHaveTextContent('1 of 5');
  });

  it('keeps pillar paths and filters across feed pages', () => {
    expect(
      getPageHref(2, { workModes: 'remote', page: '1' }, '/lt-fully-remote'),
    ).toBe('/lt-fully-remote?page=2&workModes=remote');
    expect(getPageHref(1, {}, '/o-acme~org-acme')).toBe('/o-acme~org-acme');
  });
});

describe('loading additional job cards', () => {
  it('loads a selected card once and reuses it when returning to the title', async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json(jobs[1]));
    vi.stubGlobal('fetch', fetch);
    renderStack(jobs, [jobs[0]]);
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('tab', { name: 'Engineer 1' }));
    await waitFor(() =>
      expect(
        screen.getByRole('link', { name: 'View details' }),
      ).toHaveAttribute('href', jobs[1].href),
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Engineer 0' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Engineer 1' }));
    expect(screen.getByRole('link', { name: 'View details' })).toHaveAttribute(
      'href',
      jobs[1].href,
    );
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      '/api/jobs/cards/1',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('keeps keyboard focus on the title while its details load and after they arrive', async () => {
    let finish!: (response: Response) => void;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        () =>
          new Promise<Response>((resolve) => {
            finish = resolve;
          }),
      ),
    );
    renderStack(jobs, [jobs[0]]);
    const first = screen.getByRole('tab', { name: 'Engineer 0' });
    first.focus();
    fireEvent.keyDown(first, { key: 'End' });
    expect(screen.getByText('Loading job details…')).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Engineer 4' })).toHaveFocus();
    await act(async () => finish(Response.json(jobs[4])));
    await waitFor(() =>
      expect(
        screen.getByRole('link', { name: 'View details' }),
      ).toHaveAttribute('href', jobs[4].href),
    );
    expect(screen.getByRole('tab', { name: 'Engineer 4' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer 0');
  });

  it('fetches updated details when the same job belongs to a new completed run', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json(jobs[1]))
      .mockResolvedValueOnce(
        Response.json({ ...jobs[1], title: 'Updated Engineer' }),
      );
    vi.stubGlobal('fetch', fetch);
    const { rerender, props } = renderStack(jobs, [jobs[0]]);
    fireEvent.click(screen.getByRole('tab', { name: 'Engineer 1' }));
    await waitFor(() =>
      expect(
        screen.getByRole('link', { name: 'View details' }),
      ).toHaveAttribute('href', jobs[1].href),
    );
    rerender(<JobStack {...props} importRunId='run-2' />);
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent('Updated Engineer'),
    );
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('does not display a late response for a previously selected job', async () => {
    let completeFirst!: (response: Response) => void;
    const fetch = vi.fn().mockImplementation((url: string) =>
      url.endsWith('/1')
        ? new Promise<Response>((resolve) => {
            completeFirst = resolve;
          })
        : Promise.resolve(Response.json(jobs[2])),
    );
    vi.stubGlobal('fetch', fetch);
    renderStack(jobs, [jobs[0]]);
    fireEvent.click(screen.getByRole('tab', { name: 'Engineer 1' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Engineer 2' }));
    await waitFor(() =>
      expect(
        screen.getByRole('link', { name: 'View details' }),
      ).toHaveAttribute('href', jobs[2].href),
    );
    await act(async () => completeFirst(Response.json(jobs[1])));
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer 2');
    expect(screen.getByRole('link', { name: 'View details' })).toHaveAttribute(
      'href',
      jobs[2].href,
    );
  });

  it.each(['server error', 'wrong job', 'invalid card'])(
    'keeps navigation available and offers the job page after %s',
    async (failure) => {
      const response =
        failure === 'server error'
          ? Response.json({ error: 'SQL secret' }, { status: 500 })
          : failure === 'wrong job'
            ? Response.json(jobs[2])
            : Response.json({ id: jobs[1].id });
      const fetch = vi.fn().mockResolvedValue(response);
      vi.stubGlobal('fetch', fetch);
      renderStack(jobs, [jobs[0]]);
      fireEvent.click(screen.getByRole('tab', { name: 'Engineer 1' }));
      expect(
        await screen.findByRole('link', { name: 'View job details' }),
      ).toHaveAttribute('href', jobs[1].href);
      expect(screen.queryByText(/SQL secret|Job lookup mismatch/)).toBeNull();
      expect(fetch).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByRole('tab', { name: 'Engineer 0' }));
      expect(screen.getByRole('heading')).toHaveTextContent('Engineer 0');
    },
  );
});
