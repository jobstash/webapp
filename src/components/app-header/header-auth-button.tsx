'use client';

import type { ComponentType } from 'react';

import { CircleUserIcon, GithubIcon, MailIcon, WalletIcon } from 'lucide-react';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { useEligibility } from '@/hooks/use-eligibility';
import { Button } from '@/components/ui/button';
import { LinkWithLoader } from '@/components/link-with-loader';
import { GoogleIcon } from '@/components/svg/google-icon';

const AUTH_BUTTON_PLACEHOLDER = <div className='h-9 min-w-[4.5rem]' />;

const handleClick = () => {
  trackEvent(GA_EVENT.HERO_CTA_CLICKED, { source: 'header_cta' });
};

const IDENTITY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  google: GoogleIcon,
  email: MailIcon,
  wallet: WalletIcon,
};

const CTA_CLASS = 'gap-2 bg-input/30 px-3 text-sm lg:px-6';

export const HeaderAuthButton = () => {
  const { isAuthenticated, displayName, identityType, isLoading } =
    useEligibility();

  if (isLoading) return AUTH_BUTTON_PLACEHOLDER;

  if (isAuthenticated) {
    const Icon =
      (identityType && IDENTITY_ICONS[identityType]) || CircleUserIcon;

    return (
      <Button
        variant='secondary'
        asChild
        className={`${CTA_CLASS} animate-in duration-200 fade-in`}
      >
        <LinkWithLoader href='/profile' prefetch={false}>
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
      className='animate-in bg-input/30 px-3 text-sm duration-200 fade-in lg:px-6 lg:text-base'
    >
      <LinkWithLoader href='/login' prefetch={false} onClick={handleClick}>
        Log in
      </LinkWithLoader>
    </Button>
  );
};
