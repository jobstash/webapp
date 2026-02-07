'use client';

import { UserIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { useEligibility } from '@/hooks/use-eligibility';
import { LinkWithLoader } from '@/components/link-with-loader';
import { PrimaryCTA } from '@/components/primary-cta';

const handleClick = () => {
  trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: 'header_cta' });
};

const CTA_CLASS = 'px-3 text-sm whitespace-nowrap lg:px-6 lg:text-base';

export const HeaderAuthButton = () => {
  const { isAuthenticated, isLoading } = useEligibility();

  if (isLoading) return null;

  if (isAuthenticated) {
    return (
      <PrimaryCTA asChild className={CTA_CLASS}>
        <LinkWithLoader href='/profile' onClick={handleClick}>
          <span className='relative flex size-3'>
            <span
              className={cn(
                'absolute inline-flex size-full animate-ping rounded-full',
                'bg-violet-400 opacity-50',
              )}
            />
            <span
              className={cn(
                'relative inline-flex size-3 rounded-full bg-violet-500',
              )}
            />
          </span>
          <UserIcon className='size-4' />
          My Profile
        </LinkWithLoader>
      </PrimaryCTA>
    );
  }

  return (
    <PrimaryCTA asChild className={CTA_CLASS}>
      <LinkWithLoader href='/onboarding' onClick={handleClick}>
        Get Hired Now
      </LinkWithLoader>
    </PrimaryCTA>
  );
};
