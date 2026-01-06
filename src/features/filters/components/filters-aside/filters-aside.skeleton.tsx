import { Skeleton } from '@/components/ui/skeleton';

import { FiltersAsideLayout } from './filters-aside.layout';

export const FiltersAsideSkeleton = () => {
  return (
    <FiltersAsideLayout>
      <div className='flex flex-wrap gap-2'>
        <Skeleton className='h-7 w-48' />
        <Skeleton className='h-7 w-24' />
        <Skeleton className='h-7 w-32' />
        <Skeleton className='h-7 w-36' />
        <Skeleton className='h-7 w-20' />
        <Skeleton className='h-7 w-48' />
        <Skeleton className='h-7 w-32' />
      </div>
    </FiltersAsideLayout>
  );
};
