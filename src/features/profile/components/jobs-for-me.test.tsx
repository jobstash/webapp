// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { JobForMe, JobsForMeResponse } from '../job-preferences';

const { mockUseJobsForMe } = vi.hoisted(() => ({
  mockUseJobsForMe: vi.fn(),
}));

vi.mock('../hooks/use-jobs-for-me', () => ({
  useJobsForMe: () => mockUseJobsForMe(),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock(
  '@/features/jobs/components/job-list/job-list-item/job-list-item',
  () => ({
    JobListItem: ({ job }: { job: JobForMe['job'] }) => (
      // eslint-disable-next-line @next/next/no-html-link-for-pages
      <a href={job.href}>{job.title}</a>
    ),
  }),
);

import { JobsForMe } from './jobs-for-me';

const quote = 'Remote worldwide, except the US and APAC.';
const match: JobForMe = {
  job: {
    id: 'job-1',
    title: 'Protocol engineer',
    href: '/engineering/protocol-engineer-job-1',
    hasApplyUrl: true,
    classification: null,
    summary: null,
    location: 'Worldwide',
    locationType: 'Remote',
    addresses: null,
    infoTags: [],
    tags: [],
    availability: [],
    organization: null,
    timestampText: 'Today',
    datePosted: '2026-08-22',
    badge: null,
  },
  option: {
    classification: 'verified_remote',
    mode: 'remote',
    scope: 'global',
    includedCountries: [],
    excludedCountries: ['US', 'CA'],
    includedRegions: [],
    excludedRegions: ['APAC'],
    requiredUtcBand: null,
    preferredUtcBand: null,
    residencyRequirements: [],
    workAuthorizationRequirements: [],
    sponsorshipStatus: 'unstated',
    officeCity: null,
    attendanceCadence: null,
    travelRequirement: null,
    confidence: 'source_stated',
    evidence: [
      {
        quote,
        startOffset: 20,
        endOffset: 20 + quote.length,
        source: 'employer_body',
        trust: 'employer_body',
        provenance: 'job.description',
      },
    ],
  },
  explanation: 'The employer offers remote work.',
  needsChecking: [
    {
      code: 'add_country_for_exclusions',
      message:
        'Add your country to check whether the employer excludes your location.',
    },
    {
      code: 'sponsorship_unstated',
      message: 'The employer has not stated whether sponsorship is available.',
    },
  ],
  optionalSignals: [],
};

const response: JobsForMeResponse = {
  confirmedMatches: [],
  timezoneNearMisses: [],
  needsChecking: [match],
  summary: {
    confirmedMatches: 0,
    timezoneNearMisses: 0,
    needsChecking: 1,
    total: 1,
  },
  appliedPreferences: {
    workModes: ['remote'],
    residenceCountry: null,
    utcOffset: 5.75,
    workAuthorization: null,
    requiresSponsorship: null,
    attendancePreference: null,
    travelTolerance: null,
  },
};

describe('JobsForMe', () => {
  beforeEach(() => {
    mockUseJobsForMe.mockReturnValue({
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
  });

  it('renders the honest result group, exclusions, evidence, and receipt', () => {
    render(<JobsForMe />);

    expect(
      screen.getByRole('heading', { name: 'Needs checking (1)' }),
    ).toBeVisible();
    const exclusions = screen.getByLabelText('Excluded locations');
    expect(within(exclusions).getByText('Countries: US, CA')).toBeVisible();
    expect(within(exclusions).getByText('Regions: APAC')).toBeVisible();
    expect(screen.getByText(`“${quote}”`)).toBeVisible();
    expect(screen.getByText('UTC+5:45')).toBeVisible();
  });

  it('places a working action next to every item that needs checking', () => {
    render(<JobsForMe />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(
      within(items[0]).getByRole('link', { name: 'Add country' }),
    ).toHaveAttribute(
      'href',
      '/profile/settings?returnTo=%2Fprofile%2Fjobs#job-preferences-residence-country',
    );
    expect(
      within(items[1]).getByRole('link', { name: 'View job details' }),
    ).toHaveAttribute('href', '/engineering/protocol-engineer-job-1');
  });

  it('keeps timezone near misses separate from confirmed results', () => {
    mockUseJobsForMe.mockReturnValue({
      data: {
        ...response,
        confirmedMatches: [],
        timezoneNearMisses: [{ ...match, needsChecking: [] }],
        needsChecking: [],
        summary: {
          confirmedMatches: 0,
          timezoneNearMisses: 1,
          needsChecking: 0,
          total: 1,
        },
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    });

    render(<JobsForMe />);

    expect(
      screen.getByRole('heading', { name: 'Timezone near misses (1)' }),
    ).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: /Confirmed matches/ }),
    ).not.toBeInTheDocument();
  });

  it('keeps a latest zero-option extraction visible without inventing a mode', () => {
    mockUseJobsForMe.mockReturnValue({
      data: {
        ...response,
        needsChecking: [
          {
            ...match,
            option: null,
            explanation:
              'The employer has not stated a work arrangement for this job.',
            needsChecking: [
              {
                code: 'work_arrangement_unstated',
                message: 'Check the job for employer-authored work terms.',
              },
            ],
          },
        ],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    });

    render(<JobsForMe />);

    expect(
      screen.getByText(
        'The employer has not stated a work arrangement for this job.',
      ),
    ).toBeVisible();
    expect(
      screen.queryByLabelText('Excluded locations'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'View job details' }),
    ).toHaveAttribute('href', '/engineering/protocol-engineer-job-1');
  });
});
