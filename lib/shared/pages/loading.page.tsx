import { JobstashLogo } from '@/lib/shared/ui/svgs/jobstash-logo';

export const LoadingPage = () => {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center duration-300 animate-in fade-in-0'>
      <div className='flex flex-col items-center gap-6'>
        <div className='flex items-center gap-3'>
          <JobstashLogo className='size-12 shrink-0 animate-spin' />
          <div className='flex animate-pulse flex-col gap-0'>
            <span className='flex text-2xl font-bold'>JobStash</span>
            <span className='-mt-0.5 text-xs text-muted-foreground/80'>
              Loading please wait ...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
