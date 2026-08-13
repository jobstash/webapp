import type { Metadata } from 'next';
import Link from 'next/link';

import { DeveloperReportDashboard } from '@/features/developer-report/components/developer-report-dashboard';
import { fetchDeveloperReport } from '@/features/developer-report/server';
import { clientEnv } from '@/lib/env/client';

const title = 'Crypto Developer Report';
const description =
  'Track verified internal crypto developers, maintainers, active leads, retention, organization growth, and team movement using recorded GitHub work history.';
const canonical = `${clientEnv.FRONTEND_URL}/developers`;
const image = {
  url: `${canonical}/og`,
  width: 1200,
  height: 630,
  alt: 'Crypto Developer Report — JobStash',
};

export const metadata: Metadata = {
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

const DevelopersPage = async () => {
  const report = await fetchDeveloperReport();

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
