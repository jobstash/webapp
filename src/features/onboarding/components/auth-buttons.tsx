'use client';

import { ChromeIcon, GithubIcon, MailIcon, WalletIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

const SOCIAL_OPTIONS = [
  { label: 'Continue with GitHub', icon: GithubIcon },
  { label: 'Continue with Google', icon: ChromeIcon },
  { label: 'Continue with Email', icon: MailIcon },
] as const;

export const AuthButtons = () => (
  <div className='flex w-full flex-col items-center gap-4'>
    <div className='flex w-full max-w-xs flex-col'>
      <Button size='lg' className='w-full gap-3'>
        <WalletIcon className='size-5' />
        Connect Wallet
      </Button>
    </div>

    <div className='flex w-full max-w-xs items-center gap-3'>
      <div className='h-px flex-1 bg-border' />
      <span className='text-xs text-muted-foreground'>or</span>
      <div className='h-px flex-1 bg-border' />
    </div>

    <div className='flex w-full max-w-xs flex-col gap-3'>
      {SOCIAL_OPTIONS.map(({ label, icon: Icon }) => (
        <Button
          key={label}
          variant='outline'
          size='lg'
          className='w-full gap-3'
        >
          <Icon className='size-5' />
          {label}
        </Button>
      ))}
    </div>
  </div>
);
