import type { Metadata } from 'next';
import Link from 'next/link';

import { DeveloperReportDashboard } from '@/features/developer-report/components/developer-report-dashboard';
import { fetchDeveloperReport } from '@/features/developer-report/server';
import type { DeveloperCohort } from '@/features/developer-report/schemas';
import { clientEnv } from '@/lib/env/client';

const canonical = `${clientEnv.FRONTEND_URL}/developers`;

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const COHORTS: DeveloperCohort[] = [
  'crypto',
  'fintech',
  'ai',
  'banking',
  'tech',
];

const COHORT_LABELS: Record<DeveloperCohort, string> = {
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
    : 'crypto';
};

export const generateMetadata = async ({
  searchParams,
}: Props): Promise<Metadata> => {
  const cohort = selectedCohort(await searchParams);
  const label = COHORT_LABELS[cohort];
  const title = `${label} Developer Report`;
  const description = `Track verified internal ${label.toLowerCase()} developers, maintainers, active leads, contribution cadence, tenure, repositories, organization growth, and team movement.`;
  const pageUrl =
    cohort === 'crypto' ? canonical : `${canonical}?cohort=${cohort}`;
  const image = {
    url: `${canonical}/og?cohort=${cohort}`,
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
  const report = await fetchDeveloperReport(cohort);

  if (!report?.current) {
    return (
      <div className='flex min-h-[65vh] items-center justify-center pb-16 text-center'>
        <div className='max-w-xl rounded-2xl border border-border/60 bg-card/60 p-8'>
          <h1 className='text-3xl font-bold'>Developer report is refreshing</h1>
          <p className='mt-3 text-muted-foreground'>
            The latest complete internal-developer snapshot is being prepared.
            You can still explore people and organizations on Ecosystem Vision.
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
