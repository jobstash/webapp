import { fetchJobListPage } from '@/features/jobs/data';
import { JOBS_PER_PAGE } from '@/features/jobs/constants';
import { JobListPagination } from './job-list-pagination';

interface JobListProps {
  currentPage: number;
  searchParams: Record<string, string>;
}

export const JobList = async ({ currentPage, searchParams }: JobListProps) => {
  const { page, total, data } = await fetchJobListPage({
    page: currentPage,
    searchParams,
  });
  const totalPages = Math.ceil(total / JOBS_PER_PAGE);

  return (
    <div>
      <pre>{JSON.stringify({ page, total, searchParams }, null, 2)}</pre>
      <div className='space-y-4 py-4'>
        {data.map(({ id, title, organization }) => (
          <div key={id} className='rounded-lg bg-muted p-4'>
            <pre>
              {JSON.stringify(
                { id, title, organization: organization?.name },
                null,
                2,
              )}
            </pre>
          </div>
        ))}
      </div>
      <JobListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={searchParams}
      />
    </div>
  );
};
