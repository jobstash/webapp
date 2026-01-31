'use client';

import Link from 'next/link';

import { MessageSquareMoreIcon } from 'lucide-react';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { TelegramIcon } from '@/components/svg/telegram-icon';
import { TwitterIcon } from '@/components/svg/twitter-icon';
import { FarcasterIcon } from '@/components/svg/farcaster-icon';

const SOCIALS = [
  {
    label: 'Telegram',
    icon: TelegramIcon,
    href: 'https://telegram.me/jobstash',
  },
  {
    label: 'X',
    icon: TwitterIcon,
    href: 'https://x.com/jobstash_xyz',
  },
  {
    label: 'Farcaster',
    icon: FarcasterIcon,
    href: 'https://farcaster.xyz/~/channel/jobstash',
  },
  {
    label: 'Community',
    icon: MessageSquareMoreIcon,
    href: 'https://telegram.me/jobstashxyz',
  },
] as const;

const handleClick = (destination: string) => {
  trackEvent(GA_EVENT.EXTERNAL_LINK_CLICKED, { destination, source: 'footer' });
};

export const FooterSocials = () => {
  return (
    <div className='flex gap-4'>
      {SOCIALS.map(({ label, icon: Icon, href }) => (
        <Link
          key={label}
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={label}
          className='text-muted-foreground transition-colors hover:text-foreground'
          onClick={() => handleClick(href)}
        >
          <Icon className='size-5' />
        </Link>
      ))}
    </div>
  );
};
