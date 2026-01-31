'use client';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { LinkWithLoader } from '@/components/link-with-loader';
import { PrimaryCTA } from '@/components/primary-cta';

const handleClick = () => {
  trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: 'header_cta' });
};

export const HeaderAuthButton = () => (
  <PrimaryCTA
    asChild
    className='px-3 text-sm whitespace-nowrap lg:px-6 lg:text-base'
  >
    <LinkWithLoader href='/onboarding' onClick={handleClick}>
      Get Hired Now
    </LinkWithLoader>
  </PrimaryCTA>
);
