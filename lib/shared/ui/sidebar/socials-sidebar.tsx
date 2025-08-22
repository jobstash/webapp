import Link from 'next/link';

import { MessageSquareMoreIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/lib/shared/ui/base/tooltip';
import { FarcasterIcon } from '@/lib/shared/ui/svgs/farcaster-icon';
import { TelegramIcon } from '@/lib/shared/ui/svgs/telegram-icon';
import { TwitterIcon } from '@/lib/shared/ui/svgs/twitter-icon';

const dummyData = [
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

export const SocialsSidebar = () => {
  return (
    <div className='flex w-full justify-between rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      {dummyData.map(({ label, icon, href }) => (
        <div key={label} className='flex items-center gap-2'>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='secondary' className='h-9 w-12' asChild>
                  <Link href={href} target='_blank' rel='noopener noreferrer'>
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
