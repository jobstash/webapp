import { Skeleton } from '@/components/ui/skeleton';

import { FiltersAsideLayout } from './filters-aside.layout';

export const FiltersAsideSkeleton = () => {
  return (
    <FiltersAsideLayout>
      <div className='flex flex-wrap gap-2'>
        <Skeleton className='h-7 w-40 shrink-0' />
        <Skeleton className='h-7 w-24 shrink-0' />
        <Skeleton className='h-7 w-24 shrink-0' />
        <Skeleton className='h-7 w-28 shrink-0' />
        <Skeleton className='h-7 w-16 shrink-0' />
        <Skeleton className='h-7 w-28 shrink-0' />
        <Skeleton className='h-7 w-32 shrink-0' />
        <Skeleton className='h-7 w-28 shrink-0' />
      </div>
    </FiltersAsideLayout>
  );
};
