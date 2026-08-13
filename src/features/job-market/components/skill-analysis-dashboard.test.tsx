// @vitest-environment jsdom
import { act } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));
vi.mock('./flint-echart', () => ({
  FlintEChart: ({ ariaLabel }: { ariaLabel: string }) => (
    <div role='img' aria-label={ariaLabel} />
  ),
}));

import type { JobListItemSchema } from '@/features/jobs/schemas';
import type {
  JobMarketCompensation,
  JobMarketPoint,
  JobMarketSkillDetail,
  PillarMarket,
} from '../schemas';
import { SkillAnalysisDashboard } from './skill-analysis-dashboard';

const point = (date: string, activeJobs: number): JobMarketPoint => ({
  date,
  activeJobs,
  hiringCompanies: Math.min(activeJobs, 13),
  newJobs: activeJobs > 0 ? 1 : 0,
  salary: {
    medianMonthlyUsd: null,
    meanMonthlyUsd: null,
    p25MonthlyUsd: null,
    p75MonthlyUsd: null,
    sampleCount: 5,
    coverage: 0.25,
    reliable: false,
  },
  provenance: 'reconstructed',
  sampledAt: '2026-08-12T00:15:00.000Z',
});

const compensation = (
  overrides: Partial<JobMarketCompensation>,
): JobMarketCompensation => ({
  segment: 'remote',
  regionSlug: 'remote',
  regionLabel: 'Remote',
  regionType: 'remote',
  countryCode: null,
  medianMonthlyUsd: null,
  p25MonthlyUsd: null,
  p75MonthlyUsd: null,
  adjustedPremiumPercent: null,
  sampleCount: 6,
  employerCount: 3,
  onsiteCount: 0,
  hybridCount: 0,
  remoteCount: 6,
  activeJobs: 3,
  hiringCompanies: 3,
  activeOnsiteJobs: 0,
  activeHybridJobs: 0,
  activeRemoteJobs: 3,
  reliable: false,
  ...overrides,
});

const signal = {
  asOf: '2026-08-12',
  segment: 'remote' as const,
  status: 'insufficient' as const,
  currentMedianMonthlyUsd: 12_000,
  baselineMedianMonthlyUsd: 2_300,
  rawChangePercent: 417.9,
  adjustedChangePercent: 417.9,
  confidenceLowPercent: null,
  confidenceHighPercent: null,
  qValue: null,
  recentJobCount: 1,
  baselineJobCount: 4,
  recentEmployerCount: 1,
  baselineEmployerCount: 2,
  signalSince: null,
};

const detail: JobMarketSkillDetail = {
  asOf: '2026-08-12',
  completeThrough: '2026-08-12',
  methodologyVersion: 'market-state-v2',
  skill: { slug: 't-langgraph', label: 'LangGraph' },
  signals: [
    signal,
    { ...signal, segment: 'local', adjustedChangePercent: -250 },
  ],
  compensation: [
    compensation({}),
    compensation({
      segment: 'local',
      regionSlug: 'local',
      regionLabel: 'All local markets',
      regionType: 'aggregate',
      sampleCount: 5,
      employerCount: 4,
      activeJobs: 11,
      hiringCompanies: 8,
      activeOnsiteJobs: 7,
      activeHybridJobs: 4,
      activeRemoteJobs: 0,
      remoteCount: 0,
      onsiteCount: 3,
      hybridCount: 2,
    }),
    compensation({
      segment: 'local',
      regionSlug: 'germany',
      regionLabel: 'Germany',
      regionType: 'country',
      countryCode: 'DEU',
      sampleCount: 3,
      employerCount: 2,
      activeJobs: 4,
      hiringCompanies: 3,
      activeOnsiteJobs: 3,
      activeHybridJobs: 1,
      activeRemoteJobs: 0,
      remoteCount: 0,
      onsiteCount: 2,
      hybridCount: 1,
    }),
  ],
  history: [],
};

const market: PillarMarket = {
  asOf: '2026-08-12',
  pillar: { kind: 'tags', slug: 't-langgraph', label: 'LangGraph' },
  current: point('2026-08-12', 20),
  momentum: {
    periodDays: 7,
    currentJobs: 20,
    previousJobs: 17,
    absoluteChange: 3,
    percentChange: 17.6,
    direction: 'up',
    marketRelativeScore: 16.1,
    activeJobsChange: 3,
    hiringCompaniesChange: 2,
  },
  history: [
    point('2026-01-01', 0),
    point('2026-01-02', 0),
    point('2026-07-01', 4),
    point('2026-08-12', 20),
  ],
  compensation: detail.compensation,
  skillSignals: detail.signals,
};

const jobs: JobListItemSchema[] = [
  {
    id: 'job-1',
    title: 'LangGraph Engineer',
    href: '/langgraph-engineer/job-1',
    hasApplyUrl: true,
    classification: 'AI',
    summary: null,
    location: 'Remote',
    locationType: 'REMOTE',
    addresses: null,
    infoTags: [],
    tags: [],
    availability: [],
    organization: null,
    timestampText: '1 day ago',
    datePosted: '2026-08-11',
    badge: null,
  },
];

afterEach(() => {
  cleanup();
  push.mockClear();
});

describe('SkillAnalysisDashboard', () => {
  it('hydrates the skill analysis without replacing server markup', async () => {
    (
      globalThis as typeof globalThis & {
        IS_REACT_ACT_ENVIRONMENT?: boolean;
      }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    const element = (
      <SkillAnalysisDashboard
        detail={detail}
        market={market}
        jobs={jobs}
        selection={{ range: 'max', mode: 'remote', skill: 't-langgraph' }}
      />
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(element);
    document.body.append(container);
    const initialMarkup = container.innerHTML;

    const root = hydrateRoot(container, element);
    await act(async () => {});

    expect(container.innerHTML).toBe(initialMarkup);
    await act(async () => root.unmount());
    container.remove();
  });

  it('keeps the analysis scoped to the selected skill and withholds noise', async () => {
    const user = userEvent.setup();
    render(
      <SkillAnalysisDashboard
        detail={detail}
        market={market}
        jobs={jobs}
        selection={{ range: 'max', mode: 'remote', skill: 't-langgraph' }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'LangGraph jobs, activity & pay' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'LangGraph jobs, activity & pay' })
        .childNodes,
    ).toHaveLength(1);
    expect(
      screen.getByText(/every number on this page is limited/i),
    ).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('LangGraph Engineer')).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: /langgraph open jobs, hiring companies, and new jobs over time/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('No defensible remote salary trend yet'),
    ).toBeInTheDocument();
    expect(screen.getByText('Repricing signal withheld')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Germany' })).toHaveAttribute(
      'href',
      '/l-germany?tags=langgraph',
    );
    expect(screen.queryByText('+417.9%')).toBeNull();
    expect(screen.queryByText('Opportunity map')).toBeNull();
    expect(screen.queryByText('What skills are worth now')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'local · 11 open' }));
    expect(push).toHaveBeenCalledWith('/market?mode=local&skill=t-langgraph');

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'History shown' }),
      '365',
    );
    expect(push).toHaveBeenCalledWith('/market?range=365&skill=t-langgraph');
  });
});
