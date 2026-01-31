import { ApplyButton } from './apply-button';

interface CtaCardProps {
  applyUrl: string | null;
  isExpertJob: boolean;
  jobId: string;
  jobTitle: string;
  organization: string | null;
}

export const CtaCard = ({
  applyUrl,
  isExpertJob,
  jobId,
  jobTitle,
  organization,
}: CtaCardProps) => {
  if (!applyUrl && !isExpertJob) return null;

  return (
    <div className='hidden rounded-2xl border border-neutral-800/50 bg-sidebar p-4 lg:block'>
      <ApplyButton
        applyUrl={applyUrl}
        isExpertJob={isExpertJob}
        jobId={jobId}
        jobTitle={jobTitle}
        organization={organization}
        className='w-full'
      />
    </div>
  );
};
