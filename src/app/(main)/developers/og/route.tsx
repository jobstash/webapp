import { renderDeveloperReportOg } from '@/features/developer-report/server/og';
import { fetchDeveloperReport } from '@/features/developer-report/server';
import type { DeveloperCohort } from '@/features/developer-report/schemas';

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
  all: 'Internal',
  crypto: 'Crypto',
  fintech: 'Fintech',
  ai: 'AI',
  banking: 'Banking',
  tech: 'Tech',
};

export const GET = async (request: Request) => {
  const rawCohort = new URL(request.url).searchParams.get('cohort');
  const cohort = COHORTS.includes(rawCohort as DeveloperCohort)
    ? (rawCohort as DeveloperCohort)
    : 'all';
  const report = await fetchDeveloperReport(cohort);
  return renderDeveloperReportOg(report, COHORT_LABELS[cohort]);
};
