import Link from 'next/link';

import { MessageSquareMoreIcon } from 'lucide-react';
import { TelegramIcon } from '@/components/svg/telegram-icon';
import { TwitterIcon } from '@/components/svg/twitter-icon';
import { FarcasterIcon } from '@/components/svg/farcaster-icon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const SOCIALS = [
  {
    label: 'Telegram',
    icon: <TelegramIcon />,
    href: 'https://telegram.me/jobstash',
  },
  {
    label: 'X',
    icon: <TwitterIcon />,
    href: 'https://x.com/jobstash_xyz',
  },
  {
    label: 'Farcaster',
    icon: <FarcasterIcon />,
    href: 'https://farcaster.xyz/~/channel/jobstash',
  },
  {
    label: 'Community',
    icon: <MessageSquareMoreIcon />,
    href: 'https://telegram.me/jobstashxyz',
  },
];

export const SocialsAside = () => {
  return (
    <div className='flex w-full justify-between rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      {SOCIALS.map(({ label, icon, href }) => (
        <div key={label} className='flex items-center gap-2'>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='secondary' className='h-9 w-12' asChild>
                  <Link
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={label}
                  >
                    {icon}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </div>
  );
};
