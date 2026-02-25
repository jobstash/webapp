'use client';

import { useState } from 'react';

import {
  ArrowLeftIcon,
  ChromeIcon,
  GithubIcon,
  MailIcon,
  WalletIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  type AuthMethod,
  type EmailStep,
  useAuthButtons,
} from './use-auth-buttons';

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

interface EmailFormProps {
  step: Exclude<EmailStep, 'idle'>;
  emailAddress: string;
  isLoading: boolean;
  onEmailSubmit: (email: string) => void;
  onCodeSubmit: (code: string) => void;
  onBack: () => void;
}

const EmailForm = ({
  step,
  emailAddress,
  isLoading,
  onEmailSubmit,
  onCodeSubmit,
  onBack,
}: EmailFormProps) => {
  const [value, setValue] = useState('');

  if (step === 'entering-email') {
    return (
      <form
        className='flex w-full flex-col gap-4'
        onSubmit={(e) => {
          e.preventDefault();
          onEmailSubmit(value);
        }}
      >
        <Input
          type='email'
          placeholder='Enter your email'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          disabled={isLoading}
        />
        <Button type='submit' disabled={isLoading || !value}>
          Send Code
        </Button>
        <button
          type='button'
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
          onClick={onBack}
        >
          <ArrowLeftIcon className='size-3.5' />
          Back
        </button>
      </form>
    );
  }

  return (
    <form
      className='flex w-full flex-col gap-4'
      onSubmit={(e) => {
        e.preventDefault();
        onCodeSubmit(value);
      }}
    >
      <p className='text-sm text-muted-foreground'>
        Code sent to <span className='text-foreground'>{emailAddress}</span>
      </p>
      <Input
        type='text'
        inputMode='numeric'
        placeholder='Enter verification code'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        disabled={isLoading}
      />
      <Button type='submit' disabled={isLoading || !value}>
        Verify Code
      </Button>
      <button
        type='button'
        className='inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
        onClick={onBack}
      >
        <ArrowLeftIcon className='size-3.5' />
        Back
      </button>
    </form>
  );
};

export const AuthButtons = () => {
  const auth = useAuthButtons();
  const {
    isLoading,
    preferredMethod,
    emailStep,
    emailAddress,
    handleEmailSubmit,
    handleCodeSubmit,
    handleEmailBack,
  } = auth;

  if (emailStep !== 'idle') {
    return (
      <div className='flex w-full flex-col items-center gap-5'>
        <EmailForm
          key={emailStep}
          step={emailStep}
          emailAddress={emailAddress}
          isLoading={isLoading}
          onEmailSubmit={handleEmailSubmit}
          onCodeSubmit={handleCodeSubmit}
          onBack={handleEmailBack}
        />
      </div>
    );
  }

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
