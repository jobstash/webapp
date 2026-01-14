import { Suspense } from 'react';

import { SocialsAside } from '@/components/socials-aside';
import { FiltersAside } from '@/features/filters/components/filters-aside';
import { JobList } from '@/features/jobs/components/job-list/job-list';
import { JobListBoundary } from '@/features/jobs/components/job-list/job-list-boundary.error';
import { fetchJobListPage } from '@/features/jobs/server/data';

interface Props {
  searchParams: Promise<Record<string, string> & { page?: string }>;
}

const preload = (page: number, searchParams: Record<string, string>) => {
  const pagesToPreload = [page - 2, page - 1, page + 1, page + 2].filter(
    (p) => p >= 1,
  );
  pagesToPreload.forEach((p) => {
    fetchJobListPage({ page: p, searchParams }).catch((error) => {
      console.warn(`[Preload] Failed to preload page ${p}:`, error.message);
    });
  });
};

const JobListError = () => (
  <div className='flex flex-col items-center justify-center gap-2 py-12'>
    <p className='text-muted-foreground'>Failed to load jobs</p>
    <p className='text-sm text-muted-foreground'>
      Please try refreshing the page
    </p>
  </div>
);

const HomePage = async ({ searchParams }: Props) => {
  const { page, ...restSearchParams } = await searchParams;
  const currentPage = Number(page) || 1;
  preload(currentPage, restSearchParams);

  return (
    <div className='flex gap-4'>
      <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-68 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
        <FiltersAside />
        <SocialsAside />
      </aside>
      <section className='grow'>
        <Suspense
          fallback={
            <div className='py-12 text-center text-muted-foreground'>
              Loading jobs...
            </div>
          }
        >
          <JobListBoundary fallback={<JobListError />}>
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
