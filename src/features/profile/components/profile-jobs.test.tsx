// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProfileJobs } from './profile-jobs';
import { useProfileEditor } from './profile-editor-provider';
import { useSuggestedJobsCard } from './use-suggested-jobs-card';

vi.mock('./profile-editor-provider', () => ({
  useProfileEditor: vi.fn(),
}));

vi.mock('./use-suggested-jobs-card', () => ({
  useSuggestedJobsCard: vi.fn(),
}));

vi.mock(
  '@/features/jobs/components/job-list/job-list-item/job-list-item',
  () => ({
    JobListItem: ({ job }: { job: { id: string } }) => (
      <div data-testid={`job-${job.id}`}>{job.id}</div>
    ),
  }),
);

vi.mock(
  '@/features/jobs/components/job-list/job-list-item/job-list-item.skeleton',
  () => ({
    JobListItemSkeleton: () => <div data-testid='job-skeleton' />,
  }),
);

const openSkillsEditor = vi.fn();
const openResumeUpload = vi.fn();
const openManualLinksEditor = vi.fn();
const refetch = vi.fn();
const fetchNextPage = vi.fn();

const state = (
  overrides: Partial<ReturnType<typeof useSuggestedJobsCard>> = {},
): ReturnType<typeof useSuggestedJobsCard> => ({
  jobs: [],
  isError: false,
  isPending: false,
  hasSkills: true,
  hasResume: true,
  isSkillsPending: false,
  hasMore: false,
  fetchNextPage,
  isFetchingNextPage: false,
  refetch,
  isFetching: false,
  ...overrides,
});

describe('ProfileJobs', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProfileEditor).mockReturnValue({
      openSkillsEditor,
      openResumeUpload,
      openManualLinksEditor,
    });
  });

  it('renders loading skeletons while profile inputs are loading', () => {
    vi.mocked(useSuggestedJobsCard).mockReturnValue(
      state({ isSkillsPending: true }),
    );
    render(<ProfileJobs />);
    expect(screen.getAllByTestId('job-skeleton')).toHaveLength(3);
  });

  it('opens resume upload when neither a resume nor skills are available', () => {
    vi.mocked(useSuggestedJobsCard).mockReturnValue(
      state({ hasSkills: false, hasResume: false }),
    );
    render(<ProfileJobs />);
    fireEvent.click(screen.getByRole('button', { name: 'Upload Resume' }));
    expect(openResumeUpload).toHaveBeenCalledOnce();
  });

  it('opens the skills editor when a resume has no extracted skills', () => {
    vi.mocked(useSuggestedJobsCard).mockReturnValue(
      state({ hasSkills: false }),
    );
    render(<ProfileJobs />);
    fireEvent.click(screen.getByRole('button', { name: 'Add Skills' }));
    expect(openSkillsEditor).toHaveBeenCalledOnce();
  });

  it('recovers from a transient service failure and keeps browsing available', () => {
    vi.mocked(useSuggestedJobsCard).mockReturnValue(state({ isError: true }));
    render(<ProfileJobs />);
    fireEvent.click(screen.getByRole('button', { name: /Retry/i }));
    expect(refetch).toHaveBeenCalledOnce();
    expect(
      screen.getByRole('link', { name: 'Browse all jobs' }),
    ).toHaveAttribute('href', '/');
  });

  it('offers the market as recovery from an empty result', () => {
    vi.mocked(useSuggestedJobsCard).mockReturnValue(state());
    render(<ProfileJobs />);
    expect(
      screen.getByText('No matching jobs found. Check back soon.'),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Browse all jobs' }),
    ).toHaveAttribute('href', '/');
  });

  it('renders results and loads the next page', () => {
    vi.mocked(useSuggestedJobsCard).mockReturnValue(
      state({ jobs: [{ id: 'one' }] as never[], hasMore: true }),
    );
    render(<ProfileJobs />);
    expect(screen.getByTestId('job-one')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Load More' }));
    expect(fetchNextPage).toHaveBeenCalledOnce();
  });
});
