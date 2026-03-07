'use client';

import Link from 'next/link';

import { useEligibility } from '@/hooks/use-eligibility';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const SKELETON = <Skeleton className='h-10 w-36 rounded-lg' />;

const handleClick = () => {
  trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: 'hero_jobs_for_you' });
};

export const HeroJobsForYouButton = () => {
  const { isAuthenticated, isLoading } = useEligibility();

  if (isLoading) return SKELETON;

  return (
    <Button
      size='lg'
      variant='secondary'
      className='bg-input/30 text-base'
      asChild
    >
      <Link
        href={isAuthenticated ? '/profile/jobs' : '/login'}
        prefetch={false}
        onClick={handleClick}
      >
        Jobs For You
      </Link>
    </Button>
  );
};
