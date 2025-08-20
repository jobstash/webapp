import { JobstashLogo } from '@/lib/shared/ui/svgs/jobstash-logo';

export const LoadingPage = () => {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center gap-6'>
        <div className='flex items-center gap-3'>
          <JobstashLogo className='size-12 shrink-0' />
          <div className='flex flex-col gap-0'>
            <span className='flex text-2xl font-bold'>JobStash</span>
            <span className='-mt-0.5 animate-pulse text-xs text-muted-foreground/80'>
              Loading please wait ...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
