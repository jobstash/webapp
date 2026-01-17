import { fetchJobListPage } from '@/features/jobs/server/data';
import { JOBS_PER_PAGE } from '@/features/jobs/constants';
import { JobListPagination } from './job-list-pagination';
import { JobListItem } from './job-list-item';

interface JobListProps {
  currentPage: number;
  searchParams: Record<string, string>;
}

export const JobList = async ({ currentPage, searchParams }: JobListProps) => {
  try {
    const { total, data } = await fetchJobListPage({
      page: currentPage,
      searchParams,
    });
    const totalPages = Math.ceil(total / JOBS_PER_PAGE);

    return (
      <div>
        <div className='space-y-4 py-4'>
          {data.map((job) => (
            <JobListItem key={job.id} job={job} />
          ))}
        </div>
        <JobListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          searchParams={searchParams}
        />
      </div>
    );
  } catch (error) {
    console.error('[JobList] Failed to load jobs:', error);
    return (
      <div
        role='alert'
        className='flex flex-col items-center justify-center gap-2 py-12'
      >
        <p className='text-muted-foreground'>Failed to load jobs</p>
        <p className='text-sm text-muted-foreground'>
          Please try refreshing the page
        </p>
      </div>
    );
  }
};
