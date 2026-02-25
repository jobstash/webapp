'use client';

import { useState } from 'react';
import { type ReactNode } from 'react';

import { ArrowLeftIcon, CheckIcon, MailIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import type { EmailStep } from './use-auth-buttons';

interface EmailLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  step: Exclude<EmailStep, 'idle'>;
  emailAddress: string;
  isLoading: boolean;
  onEmailSubmit: (email: string) => void;
  onCodeSubmit: (code: string) => void;
}

const GradientIconCircle = ({ children }: { children: ReactNode }) => (
  <div className='flex size-14 items-center justify-center rounded-full bg-linear-to-br from-[#8743FF]/20 to-[#D68800]/20 ring-1 ring-white/10'>
    {children}
  </div>
);

interface EnterEmailStepProps {
  isLoading: boolean;
  onEmailSubmit: (email: string) => void;
}

const EnterEmailStep = ({ isLoading, onEmailSubmit }: EnterEmailStepProps) => {
  const [value, setValue] = useState('');

  return (
    <div className='flex flex-col items-center gap-6 py-2'>
      <GradientIconCircle>
        <MailIcon className='size-6 text-white' />
      </GradientIconCircle>

      <div className='flex flex-col items-center gap-1 text-center'>
        <p className='text-lg font-semibold'>Sign in with email</p>
        <p className='text-sm text-muted-foreground'>
          {"We'll send a one-time code"}
        </p>
      </div>

      <form
        className='flex flex-col items-center gap-4'
        onSubmit={(e) => {
          e.preventDefault();
          onEmailSubmit(value);
        }}
      >
        <Input
          type='email'
          placeholder='you@example.com'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          disabled={isLoading}
          className='w-52 focus-visible:ring-[#8743FF]/50'
        />
        <div
          className={cn(
            'w-52 rounded-lg bg-linear-to-r from-[#8743FF] to-[#D68800] p-px',
            (isLoading || !value) && 'opacity-50',
          )}
        >
          <Button
            type='submit'
            size='lg'
            className={cn(
              'w-full gap-3 rounded-[calc(var(--radius-lg)-1px)]',
              'bg-sidebar font-semibold text-white',
              'hover:bg-sidebar/80',
              'disabled:opacity-100',
            )}
            disabled={isLoading || !value}
          >
            Send Code
          </Button>
        </div>
      </form>
    </div>
  );
};

interface CodeSentStepProps {
  emailAddress: string;
  isLoading: boolean;
  onCodeSubmit: (code: string) => void;
}

const CodeSentStep = ({
  emailAddress,
  isLoading,
  onCodeSubmit,
}: CodeSentStepProps) => {
  const [value, setValue] = useState('');

  return (
    <div className='flex flex-col items-center gap-6 py-2'>
      <GradientIconCircle>
        <CheckIcon className='size-6 text-white' />
      </GradientIconCircle>

      <div className='flex flex-col items-center gap-1 text-center'>
        <p className='text-lg font-semibold'>Check your inbox</p>
        <p className='text-sm text-muted-foreground'>
          Code sent to <span className='text-foreground'>{emailAddress}</span>
        </p>
      </div>

      <form
        className='flex flex-col items-center gap-4'
        onSubmit={(e) => {
          e.preventDefault();
          onCodeSubmit(value);
        }}
      >
        <Input
          type='text'
          inputMode='numeric'
          placeholder='Enter code'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          disabled={isLoading}
          className='w-52 text-center tracking-widest focus-visible:ring-[#8743FF]/50'
        />
        <div
          className={cn(
            'w-52 rounded-lg bg-linear-to-r from-[#8743FF] to-[#D68800] p-px',
            (isLoading || !value) && 'opacity-50',
          )}
        >
          <Button
            type='submit'
            size='lg'
            className={cn(
              'w-full gap-3 rounded-[calc(var(--radius-lg)-1px)]',
              'bg-sidebar font-semibold text-white',
              'hover:bg-sidebar/80',
              'disabled:opacity-100',
            )}
            disabled={isLoading || !value}
          >
            Verify Code
          </Button>
        </div>
      </form>
    </div>
  );
};

export const EmailLoginDialog = ({
  isOpen,
  onClose,
  step,
  emailAddress,
  isLoading,
  onEmailSubmit,
  onCodeSubmit,
}: EmailLoginDialogProps) => (
  <Dialog
    open={isOpen}
    onOpenChange={(open) => {
      if (!open && !isLoading) onClose();
    }}
  >
    <DialogContent
      className='max-w-xs border-neutral-800 bg-sidebar'
      showCloseButton={!isLoading}
    >
      <DialogTitle className='sr-only'>Sign in with email</DialogTitle>
      <DialogDescription className='sr-only'>
        Enter your email to receive a one-time verification code.
      </DialogDescription>
      {step !== 'entering-email' && (
        <button
          type='button'
          className='absolute top-4 left-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50'
          onClick={onClose}
          disabled={isLoading}
        >
          <ArrowLeftIcon className='size-3.5' />
          Back
        </button>
      )}
      {step === 'entering-email' ? (
        <EnterEmailStep isLoading={isLoading} onEmailSubmit={onEmailSubmit} />
      ) : (
        <CodeSentStep
          emailAddress={emailAddress}
          isLoading={isLoading}
          onCodeSubmit={onCodeSubmit}
        />
      )}
    </DialogContent>
  </Dialog>
);
