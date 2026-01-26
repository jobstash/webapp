'use client';

import { useTransition } from 'react';
import { useRouter } from '@bprogress/next/app';
import { ArrowLeftIcon, LoaderCircleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export const BackToJobs = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-busy={isPending || undefined}
      className={cn(
        'inline-flex items-center gap-2 text-sm text-muted-foreground',
        'transition-colors hover:text-foreground',
        isPending && 'pointer-events-none opacity-50',
      )}
    >
      {isPending ? (
        <LoaderCircleIcon className='size-4 animate-spin' />
      ) : (
        <ArrowLeftIcon className='size-4' />
      )}
      Back to Jobs
    </button>
  );
};
