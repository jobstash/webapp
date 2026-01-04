import { Skeleton } from '@/lib/shared/ui/base/skeleton';

export const FiltersAsideSkeleton = () => {
  return (
    <div className='flex w-full flex-col gap-4 overflow-y-auto rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <Skeleton className='h-6 w-24' />
      <div className='flex flex-wrap gap-2'>
        <Skeleton className='h-7 w-48' />
        <Skeleton className='h-7 w-24' />
        <Skeleton className='h-7 w-32' />
        <Skeleton className='h-7 w-36' />
        <Skeleton className='h-7 w-20' />
        <Skeleton className='h-7 w-48' />
        <Skeleton className='h-7 w-32' />
      </div>
    </div>
  );
};
