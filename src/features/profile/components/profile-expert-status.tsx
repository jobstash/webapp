'use client';

import {
  ArrowRightIcon,
  InfoIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LinkWithLoader } from '@/components/link-with-loader';
import { useSession } from '@/features/auth/hooks/use-session';

export const ProfileExpertStatus = () => {
  const { isExpert } = useSession();

  if (isExpert) {
    return (
      <div className='rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
        <div className='flex items-stretch gap-3'>
          <div
            className={cn(
              'flex w-10 shrink-0 items-center justify-center rounded-lg',
              'bg-emerald-500/15 ring-1 ring-emerald-500/20',
            )}
          >
            <ShieldCheckIcon className='size-5 text-emerald-400' />
          </div>

          <div className='flex min-w-0 grow flex-col justify-center'>
            <div className='flex items-center gap-1.5'>
              <span className='text-base leading-tight font-semibold text-emerald-400'>
                Crypto Native
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type='button'
                    className='text-emerald-400/40 transition-colors hover:text-emerald-400'
                  >
                    <InfoIcon className='size-3.5' />
                  </button>
                </TooltipTrigger>
                <TooltipContent side='bottom' className='max-w-56'>
                  Your on-chain activity verifies you as a crypto native expert,
                  unlocking priority job matches
                </TooltipContent>
              </Tooltip>
            </div>
            <p className='text-xs text-muted-foreground'>
              Verified expert status
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LinkWithLoader
      href='/b-expert'
      className={cn(
        'group flex items-stretch gap-3 rounded-2xl border border-neutral-800/50 bg-sidebar p-4',
        'transition-colors hover:border-sky-500/25',
      )}
    >
      <div
        className={cn(
          'flex w-10 shrink-0 items-center justify-center rounded-lg',
          'bg-sky-500/10 ring-1 ring-sky-500/15',
          'transition-colors group-hover:bg-sky-500/20',
        )}
      >
        <SparklesIcon className='size-5 text-sky-400' />
      </div>

      <div className='flex min-w-0 grow flex-col justify-center'>
        <span className='text-base leading-tight font-semibold'>
          Become a Crypto Native
        </span>
        <p className='text-xs text-muted-foreground'>
          Verify for better job matches
        </p>
      </div>

      <div className='flex items-center'>
        <ArrowRightIcon className='size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
      </div>
    </LinkWithLoader>
  );
};
