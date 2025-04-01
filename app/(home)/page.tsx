import { ENV } from '@/lib/shared/core/envs';

import { fetchJobListPage } from '@/lib/jobs/server/data';

import { LazyJobList } from '@/lib/jobs/ui/lazy-job-list';
import { SsrJobList } from '@/lib/jobs/ui/ssr-job-list';

interface Props {
  searchParams: Promise<Record<string, string>>;
}

const Page = async (props: Props) => {
  const searchParams = await props.searchParams;
  const { data } = await fetchJobListPage({ page: 1, searchParams });
  const showClientJobList = data.length >= ENV.PAGE_SIZE;

  return (
    <div className='relative w-full space-y-6 overflow-x-hidden px-2.5 md:px-4'>
      <SsrJobList jobs={data} />
      {showClientJobList && <LazyJobList />}
    </div>
  );
};
export default Page;
