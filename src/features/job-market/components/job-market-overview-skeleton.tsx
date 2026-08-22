import { Skeleton } from '@/components/ui/skeleton';

export const JobMarketOverviewSkeleton = () => (
  <div className='mt-6 rounded-2xl border border-border/60 bg-card/60 p-6'>
    <Skeleton className='h-4 w-40' />
    <Skeleton className='mt-3 h-8 w-96 max-w-full' />
    <Skeleton className='mt-6 h-[420px] w-full rounded-xl' />
  </div>
);
