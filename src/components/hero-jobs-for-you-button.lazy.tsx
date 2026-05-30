'use client';

import dynamic from 'next/dynamic';

import { HeroJobsForYouButtonSkeleton } from './hero-jobs-for-you-button.skeleton';

interface Props {
  variant?: 'primary' | 'secondary';
}

// next/dynamic's `loading` can't receive props, so the chunk-load fallback can't
// know the variant. Use one wrapper per variant (both resolve to the same chunk)
// so the loading skeleton always matches the resolved button — no layout shift.
const PrimaryButton = dynamic(
  () =>
    import('./hero-jobs-for-you-button').then(
      (mod) => mod.HeroJobsForYouButton,
    ),
  {
    ssr: false,
    loading: () => <HeroJobsForYouButtonSkeleton variant='primary' />,
  },
);

const SecondaryButton = dynamic(
  () =>
    import('./hero-jobs-for-you-button').then(
      (mod) => mod.HeroJobsForYouButton,
    ),
  {
    ssr: false,
    loading: () => <HeroJobsForYouButtonSkeleton variant='secondary' />,
  },
);

export const HeroJobsForYouButton = ({ variant = 'secondary' }: Props) =>
  variant === 'primary' ? (
    <PrimaryButton variant='primary' />
  ) : (
    <SecondaryButton variant='secondary' />
  );
