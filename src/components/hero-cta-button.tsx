'use client';

import Link from 'next/link';

import { useEligibility } from '@/hooks/use-eligibility';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { PrimaryCTA } from '@/components/primary-cta';
import { Skeleton } from '@/components/ui/skeleton';

const HERO_CTA_SKELETON = <Skeleton className='h-10 w-36 rounded-lg' />;

const handleClick = () => {
  trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: 'hero_jobs_for_you' });
};

export const HeroCtaButton = () => {
  const { isAuthenticated, isLoading } = useEligibility();

  if (isLoading) return HERO_CTA_SKELETON;

  return (
    <PrimaryCTA asChild className='px-6 text-base'>
      <Link
        href={isAuthenticated ? '/profile/jobs' : '/login'}
        prefetch={false}
        onClick={handleClick}
      >
        Jobs For You
      </Link>
    </PrimaryCTA>
  );
};
