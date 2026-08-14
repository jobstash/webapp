import { renderDeveloperReportOg } from '@/features/developer-report/server/og';
import { fetchDeveloperReport } from '@/features/developer-report/server';
import type {
  DeveloperCohort,
  DeveloperReportRange,
} from '@/features/developer-report/schemas';

export const runtime = 'nodejs';

const COHORTS: DeveloperCohort[] = [
  'all',
  'crypto',
  'fintech',
  'ai',
  'banking',
  'tech',
];

const COHORT_LABELS: Record<DeveloperCohort, string> = {
  all: 'Ecosystem',
  crypto: 'Crypto',
  fintech: 'Fintech',
  ai: 'AI',
  banking: 'Banking',
  tech: 'Tech',
};

export const GET = async (request: Request) => {
  const search = new URL(request.url).searchParams;
  const rawCohort = search.get('cohort');
  const cohort = COHORTS.includes(rawCohort as DeveloperCohort)
    ? (rawCohort as DeveloperCohort)
    : 'all';
  const rawRange = search.get('range');
  const range: DeveloperReportRange =
    rawRange === '1y' || rawRange === '3y' ? rawRange : 'all';
  const report = await fetchDeveloperReport(cohort, undefined, range);
  return renderDeveloperReportOg(report, COHORT_LABELS[cohort]);
};
