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
  },
  {
    label: 'X',
    icon: <TwitterIcon />,
  },
  {
    label: 'Farcaster',
    icon: <FarcasterIcon />,
  },
  {
    label: 'Community',
    icon: <MessageSquareMoreIcon />,
  },
];

export const SocialsSidebar = () => {
  return (
    <div className='flex w-full justify-between rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      {dummyData.map(({ label, icon }) => (
        <div key={label} className='flex items-center gap-2'>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='secondary' size='icon' className='size-8 rounded-sm'>
                  {icon}
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
