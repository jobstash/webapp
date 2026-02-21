'use client';

import { CircleUserIcon, GithubIcon, MailIcon, WalletIcon } from 'lucide-react';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { useEligibility } from '@/hooks/use-eligibility';
import { Button } from '@/components/ui/button';
import { LinkWithLoader } from '@/components/link-with-loader';
import { Skeleton } from '@/components/ui/skeleton';

const AUTH_BUTTON_SKELETON = (
  <Skeleton className='h-10 w-32 rounded-lg lg:w-40' />
);

const handleClick = () => {
  trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: 'header_cta' });
};

const IDENTITY_ICONS: Record<string, typeof CircleUserIcon> = {
  github: GithubIcon,
  email: MailIcon,
  wallet: WalletIcon,
};

const CTA_CLASS = 'gap-2 bg-input/30 px-3 text-sm lg:px-6';

export const HeaderAuthButton = () => {
  const { isAuthenticated, displayName, identityType, isLoading } =
    useEligibility();

  if (isLoading) return AUTH_BUTTON_SKELETON;

  if (isAuthenticated) {
    const Icon =
      (identityType && IDENTITY_ICONS[identityType]) || CircleUserIcon;

    return (
      <Button variant='secondary' asChild className={CTA_CLASS}>
        <LinkWithLoader href='/profile'>
          <Icon className='size-4 shrink-0' />
          <span className='max-w-32 truncate leading-tight lg:max-w-44'>
            {displayName ?? 'Account'}
          </span>
        </LinkWithLoader>
      </Button>
    );
  }

  return (
    <Button
      variant='secondary'
      asChild
      className='bg-input/30 px-3 text-sm lg:px-6 lg:text-base'
    >
      <LinkWithLoader href='/login' onClick={handleClick}>
        Log in
      </LinkWithLoader>
    </Button>
  );
};
