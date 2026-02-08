'use client';

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
          My Profile
        </LinkWithLoader>
      </PrimaryCTA>
    );
  }

  return (
    <PrimaryCTA asChild className={CTA_CLASS}>
      <LinkWithLoader href='/login' onClick={handleClick}>
        Jobs For You
      </LinkWithLoader>
    </PrimaryCTA>
  );
};
