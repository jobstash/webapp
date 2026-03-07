'use client';

import dynamic from 'next/dynamic';

const SKELETON = (
  <div className='h-10 w-36 animate-pulse rounded-lg bg-muted' />
);

export const HeroJobsForYouButton = dynamic(
  () =>
    import('./hero-jobs-for-you-button').then(
      (mod) => mod.HeroJobsForYouButton,
    ),
  {
    ssr: false,
    loading: () => SKELETON,
  },
);
