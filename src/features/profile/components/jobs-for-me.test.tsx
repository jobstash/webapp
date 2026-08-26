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
  useRecommendedJobs: () => mockUseRecommendedJobs(),
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
};

describe('JobsForMe', () => {
  beforeEach(() => {
    class IntersectionObserverMock {
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
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

  it('shows one concise reason and lets the user hide a job', () => {
    render(<JobsForMe />);

    expect(screen.getByText('Engineering Manager')).toBeVisible();
    expect(
      screen.getByText('Engineering Management · Architecture'),
    ).toBeVisible();
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
});
