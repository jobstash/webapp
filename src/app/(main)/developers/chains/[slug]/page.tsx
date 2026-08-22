import type { Metadata } from 'next';
import Link from 'next/link';

import { DeveloperReportDashboard } from '@/features/developer-report/components/developer-report-dashboard';
import { developerReportOgImage } from '@/features/developer-report/og-image';
import { fetchDeveloperReport } from '@/features/developer-report/server';
import type { DeveloperReportRange } from '@/features/developer-report/schemas';
import { clientEnv } from '@/lib/env/client';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const selectedRange = (
  params: Record<string, string | string[] | undefined>,
): DeveloperReportRange => {
  const raw = Array.isArray(params.range) ? params.range[0] : params.range;
  return raw === '3m' || raw === '6m' || raw === '1y' || raw === '3y'
    ? raw
    : 'max';
};

const selectedVertical = (
  params: Record<string, string | string[] | undefined>,
) => {
  const raw = Array.isArray(params.vertical)
    ? params.vertical[0]
    : params.vertical;
  return raw && /^[a-z0-9][a-z0-9_-]{0,119}$/.test(raw) ? raw : undefined;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const query = await searchParams;
  const range = selectedRange(query);
  const vertical = selectedVertical(query);
  const report = await fetchDeveloperReport(vertical, slug, range);
  const label = report?.scope.label ?? slug;
  const title = `${label} Developer Report`;
  const description = `Track active open-source developers, original commits, contribution frequency, experience, repositories, and organizations across ${label}.`;
  const baseUrl = `${clientEnv.FRONTEND_URL}/developers/chains/${slug}`;
  const canonicalSearch = new URLSearchParams();
  if (vertical) canonicalSearch.set('vertical', vertical);
  if (range !== 'max') canonicalSearch.set('range', range);
  const canonical = canonicalSearch.size
    ? `${baseUrl}?${canonicalSearch}`
    : baseUrl;
  const image = developerReportOgImage(baseUrl, title, canonicalSearch);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      siteName: 'JobStash',
      title,
      description,
      url: canonical,
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

const DeveloperChainPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const query = await searchParams;
  const range = selectedRange(query);
  const vertical = selectedVertical(query);
  const report = await fetchDeveloperReport(vertical, slug, range);

  if (!report?.current) {
    return (
      <div className='flex min-h-[65vh] items-center justify-center pb-16 text-center'>
        <div className='max-w-xl rounded-2xl border border-border/60 bg-card/60 p-8'>
          <h1 className='text-3xl font-bold'>Developer data is refreshing</h1>
          <p className='mt-3 text-muted-foreground'>
            We do not have a completed developer history for this chain yet.
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

export default DeveloperChainPage;
