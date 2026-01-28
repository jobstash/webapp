import { ApplyButton } from './apply-button';

interface CtaCardProps {
  applyUrl: string | null;
  isExpertJob: boolean;
}

export const CtaCard = ({ applyUrl, isExpertJob }: CtaCardProps) => {
  if (!applyUrl && !isExpertJob) return null;

  return (
    <div className='hidden rounded-2xl border border-neutral-800/50 bg-sidebar p-4 lg:block'>
      <ApplyButton
        applyUrl={applyUrl}
        isExpertJob={isExpertJob}
        className='w-full'
      />
    </div>
  );
};
