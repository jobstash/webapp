import Link from 'next/link';

import { MessageSquareMoreIcon } from 'lucide-react';
import { TelegramIcon } from '@/components/svg/telegram-icon';
import { TwitterIcon } from '@/components/svg/twitter-icon';
import { FarcasterIcon } from '@/components/svg/farcaster-icon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

import { SOCIALS, SOCIALS_CONTAINER } from './socials-aside.shared';

const ICONS = {
  Telegram: <TelegramIcon />,
  X: <TwitterIcon />,
  Farcaster: <FarcasterIcon />,
  Community: <MessageSquareMoreIcon />,
} as const;

const SocialsAsideContent = () => (
  <div className={SOCIALS_CONTAINER}>
    {SOCIALS.map(({ label, href }) => (
      <div key={label} className='flex items-center gap-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='secondary' className='h-9 w-12' asChild>
              <Link
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={label}
              >
                {ICONS[label]}
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      </div>
    ))}
  </div>
);

export default SocialsAsideContent;
