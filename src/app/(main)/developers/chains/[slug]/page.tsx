import type { Metadata } from 'next';
import Link from 'next/link';

import { DeveloperReportDashboard } from '@/features/developer-report/components/developer-report-dashboard';
import { fetchDeveloperReport } from '@/features/developer-report/server';
import { clientEnv } from '@/lib/env/client';

interface Props {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const report = await fetchDeveloperReport(null, slug);
  const label = report?.scope.label ?? slug;
  const title = `${label} Developer Report`;
  const description = `Track verified internal ${label} developers, maintainers, active leads, contribution cadence, tenure, repositories, organization growth, and team movement.`;
  const canonical = `${clientEnv.FRONTEND_URL}/developers/chains/${slug}`;
  const image = {
    url: `${canonical}/og`,
    width: 1200,
    height: 630,
    alt: `${title} — JobStash`,
  };

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

const DeveloperChainPage = async ({ params }: Props) => {
  const { slug } = await params;
  const report = await fetchDeveloperReport(null, slug);

  if (!report?.current) {
    return (
      <div className='flex min-h-[65vh] items-center justify-center pb-16 text-center'>
        <div className='max-w-xl rounded-2xl border border-border/60 bg-card/60 p-8'>
          <h1 className='text-3xl font-bold'>Chain report is refreshing</h1>
          <p className='mt-3 text-muted-foreground'>
            This chain does not yet have a complete internal-developer snapshot.
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
