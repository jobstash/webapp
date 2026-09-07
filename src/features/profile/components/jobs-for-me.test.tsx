// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { RecommendedJobsResponse } from '../recommended-jobs';

const { mockUseRecommendedJobs, mockDismiss, mockImpression } = vi.hoisted(
  () => ({
    mockUseRecommendedJobs: vi.fn(),
    mockDismiss: vi.fn(),
    mockImpression: vi.fn().mockResolvedValue(undefined),
  }),
);

vi.mock('../hooks/use-recommended-jobs', () => ({
  useRecommendedJobs: (page: number, rankedAt?: string) =>
    mockUseRecommendedJobs(page, rankedAt),
  useDismissRecommendedJob: () => ({
    mutate: mockDismiss,
    isPending: false,
  }),
  recordRecommendedJobImpression: mockImpression,
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href={href}>{children}</a>
  ),
}));

vi.mock(
  '@/features/jobs/components/job-list/job-list-item/job-list-item',
  () => ({
    JobListItem: ({ job }: { job: { title: string; href: string } }) => (
      // eslint-disable-next-line @next/next/no-html-link-for-pages
      <a href={job.href}>{job.title}</a>
    ),
  }),
);

import { JobsForMe } from './jobs-for-me';

const response: RecommendedJobsResponse = {
  rankingVersion: 'content-v2',
  jobs: [
    {
      reason: 'Engineering Management · Architecture',
      job: {
        id: 'job-1',
        title: 'Engineering Manager',
        href: '/engineering-manager/job-1',
        hasApplyUrl: true,
        classification: 'engineering_management',
        workArrangement: null,
        summary: null,
        location: 'Remote',
        locationType: 'Remote',
        addresses: null,
        infoTags: [],
        tags: [],
        availability: [],
        organization: null,
        timestampText: 'Today',
        datePosted: '2026-08-26',
        badge: null,
      },
    },
  ],
  total: 1,
  page: 1,
  hasMore: false,
};

describe('JobsForMe', () => {
  beforeEach(() => {
    class IntersectionObserverMock {
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    vi.stubGlobal('scrollTo', vi.fn());
    mockUseRecommendedJobs.mockReturnValue({
      data: response,
      isPending: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('shows the job without explanations and lets the user hide it', () => {
    mockUseRecommendedJobs.mockReturnValueOnce({
      data: {
        ...response,
        jobs: response.jobs.map((item) => ({
          ...item,
          reason: 'Funding Profile You Explored',
        })),
      },
      isPending: false,
      isError: false,
      isFetching: false,
    });
    render(<JobsForMe />);

    expect(screen.getByText('Engineering Manager')).toBeVisible();
    expect(
      screen.queryByText('Funding Profile You Explored'),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Hide' }));
    expect(mockDismiss).toHaveBeenCalledWith('job-1');
  });

  it('uses short error and empty messages', () => {
    mockUseRecommendedJobs.mockReturnValueOnce({
      data: undefined,
      isPending: false,
      isError: true,
      refetch: vi.fn(),
      isFetching: false,
    });
    const { rerender } = render(<JobsForMe />);
    expect(screen.getByText("Couldn't load matches.")).toBeVisible();

    mockUseRecommendedJobs.mockReturnValueOnce({
      data: { jobs: [], total: 0 },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    });
    rerender(<JobsForMe />);
    expect(screen.getByText('No matches yet.')).toBeVisible();
  });

  it('renders every returned match, not just an email-sized shortlist', () => {
    mockUseRecommendedJobs.mockReturnValueOnce({
      data: {
        ...response,
        total: 51,
        jobs: Array.from({ length: 51 }, (_, index) => ({
          ...response.jobs[0],
          job: {
            ...response.jobs[0].job,
            id: `job-${index}`,
            title: `Engineer ${index}`,
          },
        })),
      },
      isPending: false,
      isError: false,
      isFetching: false,
    });
    render(<JobsForMe />);
    expect(screen.getAllByRole('button', { name: 'Hide' })).toHaveLength(51);
    expect(screen.getByText('Engineer 50')).toBeVisible();
  });

  it('lets users reach every page and shows the full match count', () => {
    mockUseRecommendedJobs.mockImplementation((page: number) => ({
      data: {
        ...response,
        page,
        total: 31,
        hasMore: page === 1,
        rankedAt: '2026-09-07T10:00:00.000Z',
        jobs: response.jobs.map((item) => ({
          ...item,
          job: { ...item.job, id: `job-${page}`, title: `Page ${page} role` },
        })),
      },
      isPending: false,
      isError: false,
      isFetching: false,
    }));
    render(<JobsForMe />);
    expect(screen.getByText('Page 1 · 31 matches')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockUseRecommendedJobs).toHaveBeenLastCalledWith(
      2,
      '2026-09-07T10:00:00.000Z',
    );
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
    expect(screen.getByText('Page 2 role')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByText('Page 1 role')).toBeVisible();
  });
});
