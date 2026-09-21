'use client';

import Link from 'next/link';
import { LoginLink } from '@/features/auth/components/login-link';

import { useEligibility } from '@/hooks/use-eligibility';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { PrimaryCTA } from '@/components/primary-cta';

import { HeroJobsForYouButtonSkeleton } from './hero-jobs-for-you-button.skeleton';

const handleClick = () => {
  trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: 'hero_jobs_for_you' });
};

interface Props {
  variant?: 'primary' | 'secondary';
}

export const HeroJobsForYouButton = ({ variant = 'secondary' }: Props) => {
  const { isAuthenticated, isLoading } = useEligibility();

  if (isLoading) return <HeroJobsForYouButtonSkeleton variant={variant} />;

  const link = isAuthenticated ? (
    <Link href='/profile/jobs' prefetch={false} onClick={handleClick}>
      Jobs For You
    </Link>
  ) : (
    <LoginLink destination='/profile/jobs' onClick={handleClick}>
      Jobs For You
    </LoginLink>
  );

  if (variant === 'primary') {
    return (
      <PrimaryCTA asChild className='px-6 text-base'>
        {link}
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
      {link}
    </Button>
  );
};
