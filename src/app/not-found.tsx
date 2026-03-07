import Link from 'next/link';

import { PrimaryCTA } from '@/components/primary-cta';

const NotFound = () => (
  <section className='relative flex min-h-[calc(100vh-12rem)] w-full items-center justify-center overflow-hidden lg:min-h-[calc(100vh-14rem)]'>
    <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/4 via-transparent to-transparent' />

    <div className='relative flex flex-col items-center gap-6 text-center'>
      <div className='flex flex-col gap-3'>
        <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>
          Nothing here anon.
        </h1>
        <p className='mx-auto max-w-md text-lg text-muted-foreground'>
          This page doesn&apos;t exist, but thousands of web3 jobs do.
        </p>
      </div>

      <div className='pt-2'>
        <PrimaryCTA asChild>
          <Link href='/'>Find Your Next Role</Link>
        </PrimaryCTA>
      </div>
    </div>
  </section>
);

export default NotFound;
