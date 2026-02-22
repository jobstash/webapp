import { ApplyButton } from './apply-button';

interface MobileApplyBarProps {
  hasApplyUrl: boolean;
  isExpertJob: boolean;
  jobId: string;
  jobTitle: string;
  organization: string | null;
}

export const MobileApplyBar = ({
  hasApplyUrl,
  isExpertJob,
  jobId,
  jobTitle,
  organization,
}: MobileApplyBarProps) => {
  if (!hasApplyUrl && !isExpertJob) return null;

  return (
    <div className='fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur-sm lg:hidden'>
      <ApplyButton
        hasApplyUrl={hasApplyUrl}
        isExpertJob={isExpertJob}
        jobId={jobId}
        jobTitle={jobTitle}
        organization={organization}
        className='w-full'
      />
    </div>
  );
};
