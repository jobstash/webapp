'use client';

import {
  ChromeIcon,
  GithubIcon,
  LoaderIcon,
  MailIcon,
  WalletIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useAuthButtons } from './use-auth-buttons';

export const AuthButtons = () => {
  const {
    isGoogleLoading,
    handleWallet,
    handleGithub,
    handleGoogle,
    handleEmail,
  } = useAuthButtons();

  return (
    <div className='flex w-full flex-col items-center gap-4'>
      <div className='flex w-full max-w-xs flex-col'>
        <Button
          size='lg'
          className='w-full gap-3'
          onClick={handleWallet}
          disabled={isGoogleLoading}
        >
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
        <Button
          variant='outline'
          size='lg'
          className='w-full gap-3'
          onClick={handleGithub}
          disabled={isGoogleLoading}
        >
          <GithubIcon className='size-5' />
          Continue with GitHub
        </Button>

        <Button
          variant='outline'
          size='lg'
          className='w-full gap-3'
          onClick={handleGoogle}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <LoaderIcon className='size-5 animate-spin' />
          ) : (
            <ChromeIcon className='size-5' />
          )}
          Continue with Google
        </Button>

        <Button
          variant='outline'
          size='lg'
          className='w-full gap-3'
          onClick={handleEmail}
          disabled={isGoogleLoading}
        >
          <MailIcon className='size-5' />
          Continue with Email
        </Button>
      </div>
    </div>
  );
};
