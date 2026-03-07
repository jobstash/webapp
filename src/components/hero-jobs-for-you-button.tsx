'use client';

import Link from 'next/link';

import { useEligibility } from '@/hooks/use-eligibility';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { PrimaryCTA } from '@/components/primary-cta';
import { Skeleton } from '@/components/ui/skeleton';

const SKELETON = <Skeleton className='h-10 w-36 rounded-lg' />;

const handleClick = () => {
  trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: 'hero_jobs_for_you' });
};

interface Props {
  variant?: 'primary' | 'secondary';
}

export const HeroJobsForYouButton = ({ variant = 'secondary' }: Props) => {
  const { isAuthenticated, isLoading } = useEligibility();

  if (isLoading) return SKELETON;

  const href = isAuthenticated ? '/profile/jobs' : '/login';

  if (variant === 'primary') {
    return (
      <PrimaryCTA asChild className='px-6 text-base'>
        <Link href={href} prefetch={false} onClick={handleClick}>
          Jobs For You
        </Link>
      </PrimaryCTA>
    );
  }

  return (
    <Button
      size='lg'
      variant='secondary'
      className='bg-input/30 text-base'
      asChild
    >
      <Link href={href} prefetch={false} onClick={handleClick}>
        Jobs For You
      </Link>
    </Button>
  );
};
