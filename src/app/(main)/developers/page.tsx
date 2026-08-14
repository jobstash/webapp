import type { Metadata } from 'next';
import Link from 'next/link';

import { DeveloperReportDashboard } from '@/features/developer-report/components/developer-report-dashboard';
import { fetchDeveloperReport } from '@/features/developer-report/server';
import type { DeveloperReportRange } from '@/features/developer-report/schemas';
import { clientEnv } from '@/lib/env/client';

const canonical = `${clientEnv.FRONTEND_URL}/developers`;
const ranges: DeveloperReportRange[] = ['3m', '6m', '1y', '3y', 'max'];
const slugPattern = /^[a-z0-9][a-z0-9_-]{0,119}$/;

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const one = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const selectedRange = (
  params: Record<string, string | string[] | undefined>,
): DeveloperReportRange => {
  const raw = one(params.range);
  return ranges.includes(raw as DeveloperReportRange)
    ? (raw as DeveloperReportRange)
    : 'max';
};

const selectedVertical = (
  params: Record<string, string | string[] | undefined>,
) => {
  const raw = one(params.vertical);
  return raw && slugPattern.test(raw) ? raw : undefined;
};

const labelFor = (slug?: string) =>
  slug
    ? slug
        .split(/[-_]/)
        .map((part) =>
          part === 'ai'
            ? 'AI'
            : `${part.charAt(0).toUpperCase()}${part.slice(1)}`,
        )
        .join(' ')
    : 'All';

export const generateMetadata = async ({
  searchParams,
}: Props): Promise<Metadata> => {
  const params = await searchParams;
  const vertical = selectedVertical(params);
  const range = selectedRange(params);
  const label = labelFor(vertical);
  const title = vertical
    ? `${label} Developer Report`
    : 'Developer Ecosystem Report';
  const description = `Track active open-source developers, original commits, contribution frequency, experience, repositories, and organizations across ${vertical ? `${label.toLowerCase()} ` : ''}software ecosystems.`;
  const search = new URLSearchParams();
  if (vertical) search.set('vertical', vertical);
  if (range !== 'max') search.set('range', range);
  const pageUrl = search.size ? `${canonical}?${search}` : canonical;

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
      images: [`${canonical}/og?${search}`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${canonical}/og?${search}`],
    },
  };
};

const DevelopersPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const vertical = selectedVertical(params);
  const range = selectedRange(params);
  const report = await fetchDeveloperReport(vertical, undefined, range);

  if (!report?.current) {
    return (
      <div className='flex min-h-[65vh] items-center justify-center pb-16 text-center'>
        <div className='max-w-xl rounded-2xl border border-border/60 bg-card/60 p-8'>
          <h1 className='text-3xl font-bold'>Developer data is refreshing</h1>
          <p className='mt-3 text-muted-foreground'>
            We do not have a completed activity history for this selection yet.
          </p>
          <Link
            href='/developers'
            className='mt-5 inline-flex rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background'
          >
            View all developers
          </Link>
        </div>
      </div>
    );
  }

  return <DeveloperReportDashboard report={report} />;
};

export default DevelopersPage;
