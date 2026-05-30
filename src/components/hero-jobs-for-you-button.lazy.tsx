'use client';

import dynamic from 'next/dynamic';

import { HeroJobsForYouButtonSkeleton } from './hero-jobs-for-you-button.skeleton';

export const HeroJobsForYouButton = dynamic(
  () =>
    import('./hero-jobs-for-you-button').then(
      (mod) => mod.HeroJobsForYouButton,
    ),
  {
    ssr: false,
    loading: () => <HeroJobsForYouButtonSkeleton />,
  },
);
