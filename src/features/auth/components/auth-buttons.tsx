'use client';

import { ChromeIcon, GithubIcon, MailIcon, WalletIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { type AuthMethod, useAuthButtons } from './use-auth-buttons';

type MethodConfig = {
  key: AuthMethod;
  icon: typeof WalletIcon;
  label: string;
};

const AUTH_METHODS: MethodConfig[] = [
  { key: 'google', icon: ChromeIcon, label: 'Google' },
  { key: 'github', icon: GithubIcon, label: 'GitHub' },
  { key: 'wallet', icon: WalletIcon, label: 'Wallet' },
  { key: 'email', icon: MailIcon, label: 'Email' },
];

const HANDLERS: Record<
  AuthMethod,
  'handleGoogle' | 'handleGithub' | 'handleWallet' | 'handleEmail'
> = {
  google: 'handleGoogle',
  github: 'handleGithub',
  wallet: 'handleWallet',
  email: 'handleEmail',
};

export const AuthButtons = () => {
  const auth = useAuthButtons();
  const { isLoading, preferredMethod } = auth;

  const primary = AUTH_METHODS.find((m) => m.key === preferredMethod)!;
  const secondary = AUTH_METHODS.filter((m) => m.key !== preferredMethod);
  const PrimaryIcon = primary.icon;

  return (
    <div className='flex w-full flex-col items-center gap-5'>
      <div className='w-fit rounded-lg bg-linear-to-r from-[#8743FF] to-[#D68800] p-px'>
        <Button
          size='lg'
          className={cn(
            'gap-3 rounded-[calc(var(--radius-lg)-1px)]',
            'bg-sidebar font-semibold text-white',
            'hover:bg-sidebar/80',
          )}
          onClick={auth[HANDLERS[primary.key]]}
          disabled={isLoading}
        >
          <PrimaryIcon className='size-5' />
          Continue with {primary.label}
        </Button>
      </div>

      <div className='flex w-full items-center gap-3'>
        <div className='h-px flex-1 bg-linear-to-r from-transparent to-border' />
        <span className='text-xs text-muted-foreground/60'>or</span>
        <div className='h-px flex-1 bg-linear-to-l from-transparent to-border' />
      </div>

      <div className='flex items-center gap-3'>
        {secondary.map(({ key, icon: Icon, label }) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon-lg'
                className='rounded-full'
                onClick={auth[HANDLERS[key]]}
                disabled={isLoading}
              >
                <Icon className='size-5' />
                <span className='sr-only'>{label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
