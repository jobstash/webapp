'use client';

import Link from 'next/link';
import { LoaderIcon } from 'lucide-react';

import { useLinkAccountContent } from './use-link-account-content';

export const LinkAccountContent = () => {
  const { isLoading, error } = useLinkAccountContent();

  if (isLoading) {
    return (
      <div className='flex h-dvh flex-col items-center justify-center bg-background'>
        <LoaderIcon className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='flex h-dvh flex-col items-center justify-center gap-3 bg-background'>
      <p className='text-sm text-destructive'>{error}</p>
      <Link
        href='/profile'
        className='text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground'
      >
        Back to profile
      </Link>
    </div>
  );
};
