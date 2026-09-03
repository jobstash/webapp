import { Suspense } from 'react';
import type { Metadata } from 'next';

import { SocialsAside } from '@/components/socials-aside';
import {
  FiltersAside,
  FiltersDrawer,
} from '@/features/filters/components/filters-aside';
import { JobList } from '@/features/jobs/components/job-list/job-list';
import { JobListBoundary } from '@/features/jobs/components/job-list/job-list.error';
import { JobListSkeleton } from '@/features/jobs/components/job-list/job-list.skeleton';
import { SuggestedPillars } from '@/features/pillar/components';
import { getPillarLinksFromSearchParams } from '@/features/pillar/constants';
import { clientEnv } from '@/lib/env/client';
import { robotsNoindexFollow } from '@/lib/seo';

interface Props {
  searchParams: Promise<Record<string, string> & { page?: string }>;
}

const HOME_TITLE = 'Crypto Jobs — Web3, DeFi & Blockchain Jobs';
const HOME_DESCRIPTION =
  'Browse crypto native jobs across the entire Web3 ecosystem — engineering, product, design, marketing and more. Aggregated from thousands of crypto organizations and updated daily.';
const HOME_URL = `${clientEnv.FRONTEND_URL}/`;
const HOME_OG_IMAGE = {
  url: `${clientEnv.FRONTEND_URL}/og?v=20260903`,
  width: 1200,
  height: 630,
  alt: 'Find your next Crypto, AI or Fintech role on JobStash',
};

export const generateMetadata = async ({
  searchParams,
}: Props): Promise<Metadata> => {
  const params = await searchParams;

  // Filtered/paginated views are near-duplicates of the bare job list:
  // keep them crawlable (follow) but out of the index, with no canonical
  // (noindex + canonical send conflicting signals).
  if (Object.keys(params).length > 0) {
    return {
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      robots: robotsNoindexFollow(),
    };
  }

  return {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    alternates: { canonical: HOME_URL },
    openGraph: {
      type: 'website',
      siteName: 'JobStash',
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      url: HOME_URL,
      images: [HOME_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      images: [HOME_OG_IMAGE],
    },
  };
};

const HomePage = async ({ searchParams }: Props) => {
  const rawSearchParams = await searchParams;
  const { page, ...restSearchParams } = rawSearchParams;
  const currentPage = Number(page) || 1;

  // Cross-link filtered views to their pillar pages (internal linking).
  const suggestedPillarLinks = getPillarLinksFromSearchParams(restSearchParams);

  return (
    <div className='flex gap-4'>
      <aside className='hidden w-68 shrink-0 flex-col gap-4 self-start lg:flex'>
        <FiltersAside />
        <SuggestedPillars items={suggestedPillarLinks} />
        <SocialsAside />
      </aside>
      <section className='min-w-0 grow'>
        <Suspense
          fallback={<JobListSkeleton mobileFilters={<FiltersDrawer />} />}
        >
          <JobListBoundary>
            <JobList
              currentPage={currentPage}
              searchParams={restSearchParams}
              mobileFilters={<FiltersDrawer />}
            />
          </JobListBoundary>
        </Suspense>
      </section>
    </div>
  );
};
export default HomePage;
