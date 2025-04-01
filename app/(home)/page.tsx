import { ENV } from '@/lib/shared/core/envs';
import { JobItemSchema, JobListPageSchema } from '@/lib/jobs/core/schemas';

import { fetchJobListPage } from '@/lib/jobs/server/data';

import { LazyJobList } from '@/lib/jobs/ui/job-list';
import { SsrJobList } from '@/lib/jobs/ui/ssr-job-list';

interface Props {
  searchParams: Promise<Record<string, string>>;
}

const Page = async (props: Props) => {
  const searchParams = await props.searchParams;
  const hasSearchParams = Object.keys(searchParams).length > 0;

  let data: JobItemSchema[] = [];
  let hasSsrNextPage = false;

  if (!hasSearchParams) {
    // Fetch data only if there are no search params
    const result: JobListPageSchema = await fetchJobListPage({ page: 1, searchParams });
    data = result.data;
    hasSsrNextPage = data.length >= ENV.PAGE_SIZE;
  }

  const showLazyJobList = hasSsrNextPage || hasSearchParams;
  const startPage = hasSsrNextPage ? 2 : 1;

  return (
    <div className='relative w-full space-y-6 overflow-x-hidden px-2.5 md:px-4'>
      {!hasSearchParams && <SsrJobList jobs={data} />}
      {showLazyJobList && <LazyJobList startPage={startPage} />}
    </div>
  );
};
export default Page;
