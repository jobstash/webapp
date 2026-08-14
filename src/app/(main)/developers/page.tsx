import type { Metadata } from 'next';
import Link from 'next/link';

import { DeveloperReportDashboard } from '@/features/developer-report/components/developer-report-dashboard';
import { fetchDeveloperReport } from '@/features/developer-report/server';
import type {
  DeveloperCohort,
  DeveloperReportRange,
} from '@/features/developer-report/schemas';
import { clientEnv } from '@/lib/env/client';

const canonical = `${clientEnv.FRONTEND_URL}/developers`;

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const COHORTS: DeveloperCohort[] = [
  'all',
  'crypto',
  'fintech',
  'ai',
  'banking',
  'tech',
];

const COHORT_LABELS: Record<DeveloperCohort, string> = {
  all: 'All Sectors',
  crypto: 'Crypto',
  fintech: 'Fintech',
  ai: 'AI',
  banking: 'Banking',
  tech: 'Tech',
};

const selectedCohort = (
  params: Record<string, string | string[] | undefined>,
): DeveloperCohort => {
  const raw = Array.isArray(params.cohort) ? params.cohort[0] : params.cohort;
  return COHORTS.includes(raw as DeveloperCohort)
    ? (raw as DeveloperCohort)
    : 'all';
};

const selectedRange = (
  params: Record<string, string | string[] | undefined>,
): DeveloperReportRange => {
  const raw = Array.isArray(params.range) ? params.range[0] : params.range;
  return raw === '1y' || raw === '3y' ? raw : 'all';
};

export const generateMetadata = async ({
  searchParams,
}: Props): Promise<Metadata> => {
  const cohort = selectedCohort(await searchParams);
  const range = selectedRange(await searchParams);
  const label = COHORT_LABELS[cohort];
  const title =
    cohort === 'all'
      ? 'Developer Ecosystem Report'
      : `${label} Developer Report`;
  const description = `Track all ${cohort === 'all' ? '' : `${label.toLowerCase()} `}contributors, verified internal people, maintainers, leads, repositories, organizations, and team movement from one consistent historical range.`;
  const pageSearch = new URLSearchParams();
  if (cohort !== 'all') pageSearch.set('cohort', cohort);
  if (range !== 'all') pageSearch.set('range', range);
  const pageUrl = pageSearch.size ? `${canonical}?${pageSearch}` : canonical;
  const imageSearch = new URLSearchParams({ cohort, range });
  const image = {
    url: `${canonical}/og?${imageSearch}`,
    width: 1200,
    height: 630,
    alt: `${title} — JobStash`,
  };

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'website',
      siteName: 'JobStash',
      title,
      description,
      url: pageUrl,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
};

const DevelopersPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const cohort = selectedCohort(params);
  const range = selectedRange(params);
  const report = await fetchDeveloperReport(cohort, undefined, range);

  if (!report?.current) {
    return (
      <div className='flex min-h-[65vh] items-center justify-center pb-16 text-center'>
        <div className='max-w-xl rounded-2xl border border-border/60 bg-card/60 p-8'>
          <h1 className='text-3xl font-bold'>Developer report is refreshing</h1>
          <p className='mt-3 text-muted-foreground'>
            The latest contributor and verified-workforce history is being
            prepared. You can still explore people and organizations on
            Ecosystem Vision.
          </p>
          <div className='mt-5 flex flex-wrap justify-center gap-3'>
            <a
              href='https://ecosystem.vision/people'
              className='rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background'
            >
              Explore people
            </a>
            <Link
              href='/market'
              className='rounded-lg border border-border px-4 py-2 text-sm font-bold'
            >
              View job market
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <DeveloperReportDashboard report={report} />;
};

export default DevelopersPage;
