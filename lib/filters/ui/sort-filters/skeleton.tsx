import { Skeleton } from '@/lib/shared/ui/base/skeleton';

export const SortFiltersSkeleton = () => {
  return (
    <div className='flex gap-2'>
      <Skeleton className='h-7 w-20' />
      <Skeleton className='h-7 w-24' />
    </div>
  );
};
