import { Skeleton } from '@/components/ui/skeleton';

const chipWidths = [80, 100, 72, 88, 96, 68, 84, 92, 76, 104, 80, 88];

export const PillarItemsSkeleton = () => (
  <section className='relative w-full overflow-hidden border-b bg-linear-to-b from-primary/5 via-background to-background'>
    {/* Subtle radial gradient */}
    <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.04] via-transparent to-transparent' />

    <div className='relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24'>
      <div className='flex flex-col items-center gap-10 text-center'>
        {/* Hero content skeleton */}
        <div className='flex flex-col items-center gap-6'>
          <Skeleton className='h-12 w-80 md:h-14 md:w-[28rem]' />
          <Skeleton className='h-6 w-64 md:w-[32rem]' />
        </div>

        {/* CTA buttons skeleton */}
        <div className='flex gap-3'>
          <Skeleton className='h-11 w-32 rounded-md' />
          <Skeleton className='h-11 w-28 rounded-md' />
        </div>

        {/* Discovery section skeleton */}
        <div className='flex w-full max-w-3xl flex-col items-center gap-6 pt-4'>
          {/* Connector skeleton */}
          <div className='flex flex-col items-center gap-2'>
            <Skeleton className='h-3 w-24' />
            <Skeleton className='size-4' />
          </div>

          {/* Chips skeleton - aligned */}
          <div className='flex flex-wrap items-center justify-center gap-2.5'>
            {chipWidths.map((width, index) => (
              <Skeleton
                key={index}
                className='h-9 rounded-full'
                style={{ width }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
