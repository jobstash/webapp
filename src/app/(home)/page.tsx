import { SocialsAside } from '@/components/socials-aside';
import { FiltersAside } from '@/features/filters/components/filters-aside';
import { JobList } from '@/features/jobs/components/job-list/job-list';
import { fetchJobListPage } from '@/features/jobs/server/data';

interface Props {
  searchParams: Promise<Record<string, string> & { page?: string }>;
}

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

  return (
    <div className='flex gap-4'>
      <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-68 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
        <FiltersAside />
        <SocialsAside />
      </aside>
      <section className='grow'>
        <JobList currentPage={currentPage} searchParams={restSearchParams} />
      </section>
    </div>
  );
};
export default HomePage;
