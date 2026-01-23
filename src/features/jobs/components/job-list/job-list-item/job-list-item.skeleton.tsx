import { Skeleton } from '@/components/ui/skeleton';

export const JobListItemSkeleton = () => {
  return (
    <article className='relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm'>
      <div className='p-5 pb-3'>
        {/* View Details */}
        <div className='absolute top-5 right-5'>
          <Skeleton className='h-7 w-24 rounded-md' />
        </div>

        {/* Badge */}
        <div className='mb-3 flex h-6 self-baseline'>
          <Skeleton className='h-5 w-20 rounded-full' />
        </div>

        <div className='space-y-4'>
          {/* Title */}
          <div className='flex h-6 justify-between gap-4 self-baseline'>
            <Skeleton className='h-6 w-64' />
          </div>

          {/* Info Tags */}
          <div className='flex flex-wrap items-center gap-2'>
            <Skeleton className='h-7 w-28 rounded-lg' />
            <Skeleton className='h-7 w-24 rounded-lg' />
            <Skeleton className='h-7 w-32 rounded-lg' />
          </div>

          {/* Org section */}
          <div className='space-y-2'>
            <div className='flex flex-wrap items-center gap-4'>
              <div className='flex items-center gap-3'>
                <Skeleton className='size-10 shrink-0 rounded-lg' />
                <Skeleton className='h-5 w-32' />
              </div>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-7 w-20 rounded-lg' />
                <Skeleton className='h-7 w-24 rounded-lg' />
              </div>
            </div>
          </div>

          {/* Tech tags */}
          <div className='flex items-center gap-1'>
            <Skeleton className='h-4 w-32' />
          </div>
        </div>
      </div>
    </article>
  );
};
