import { Skeleton } from '@/components/ui/skeleton';

export const PillarHeroSkeleton = () => {
  return (
    <section className='relative w-full overflow-hidden border-b bg-linear-to-b from-primary/5 via-background to-background'>
      {/* Radial glow - matches main component */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/4 via-transparent to-transparent' />

      <div className='relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24'>
        <div className='flex flex-col items-center gap-10 text-center'>
          {/* Hero content skeleton */}
          <div className='flex w-full flex-col items-center gap-6'>
            {/* Category pill */}
            <Skeleton className='h-7 w-20 rounded-full' />

            {/* Title */}
            <div className='flex w-full max-w-3xl flex-col items-center gap-2'>
              <Skeleton className='h-10 w-full md:h-12 lg:h-14' />
              <Skeleton className='h-10 w-2/3 md:h-12 lg:h-14' />
            </div>

            {/* Description */}
            <div className='flex w-full max-w-2xl flex-col items-center gap-2'>
              <Skeleton className='h-5 w-full md:h-6' />
              <Skeleton className='h-5 w-full md:h-6' />
              <Skeleton className='h-5 w-3/4 md:h-6' />
            </div>
          </div>

          {/* CTA skeleton */}
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Skeleton className='h-10 w-32 rounded-md' />
            <Skeleton className='h-10 w-28 rounded-md' />
          </div>
        </div>
      </div>
    </section>
  );
};
