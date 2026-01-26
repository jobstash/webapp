import { type SimilarJobSchema } from '@/features/jobs/schemas';
import { SimilarJobItem } from './similar-job-item';

interface SimilarJobsCardProps {
  jobs: SimilarJobSchema[];
}

export const SimilarJobsCard = ({ jobs }: SimilarJobsCardProps) => {
  if (jobs.length === 0) return null;

  return (
    <div className='rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <h3 className='mb-3 text-sm font-medium'>Similar Jobs</h3>
      <div className='max-h-[400px] space-y-1 overflow-y-auto'>
        {jobs.map((job) => (
          <SimilarJobItem key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};
