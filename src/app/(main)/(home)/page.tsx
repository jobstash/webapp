import { Suspense } from 'react';
import type { Metadata } from 'next';

import { SocialsAside } from '@/components/socials-aside';
import { FiltersAside } from '@/features/filters/components/filters-aside';
import { JobList } from '@/features/jobs/components/job-list/job-list';
import { JobListBoundary } from '@/features/jobs/components/job-list/job-list.error';
import { JobListSkeleton } from '@/features/jobs/components/job-list/job-list.skeleton';
import { fetchJobListPage } from '@/features/jobs/server/data';
import { SuggestedPillars } from '@/features/pillar/components';
import { getPillarLinksFromSearchParams } from '@/features/pillar/constants';
import { clientEnv } from '@/lib/env/client';
import { robotsNoindexFollow } from '@/lib/seo';

interface Props {
  searchParams: Promise<Record<string, string> & { page?: string }>;
}

const HOME_TITLE = 'Crypto Jobs — Web3, DeFi & Blockchain Jobs | JobStash';
const HOME_DESCRIPTION =
  'Browse crypto native jobs across the entire Web3 ecosystem — engineering, product, design, marketing and more. Aggregated from thousands of crypto organizations and updated daily.';

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
    alternates: { canonical: `${clientEnv.FRONTEND_URL}/` },
  };
};

const preload = (currentPage: number, searchParams: Record<string, string>) => {
  const adjacentPages = [
    currentPage - 2,
    currentPage - 1,
    currentPage + 1,
    currentPage + 2,
  ].filter((page) => page >= 1);

  for (const page of adjacentPages) {
    fetchJobListPage({ page, searchParams }).catch((error) => {
      console.warn(`[Preload] Failed to preload page ${page}:`, error.message);
    });
  }
};

const HomePage = async ({ searchParams }: Props) => {
  const { page, ...restSearchParams } = await searchParams;
  const currentPage = Number(page) || 1;
  preload(currentPage, restSearchParams);

  // Cross-link filtered views to their pillar pages (internal linking).
  const suggestedPillarLinks = getPillarLinksFromSearchParams(restSearchParams);

  return (
    <div className='flex gap-4'>
      <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-68 shrink-0 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
        <FiltersAside />
        <SuggestedPillars items={suggestedPillarLinks} />
        <SocialsAside />
      </aside>
      <section className='min-w-0 grow'>
        <Suspense fallback={<JobListSkeleton />}>
          <JobListBoundary>
            <JobList
              currentPage={currentPage}
              searchParams={restSearchParams}
            />
          </JobListBoundary>
        </Suspense>
      </section>
    </div>
  );
};
export default HomePage;
