'use client';

import Link from 'next/link';
import { LoaderIcon } from 'lucide-react';

import { useLinkAccountContent } from './use-link-account-content';

/**
 * Privy's `useLinkAccount` hook renders its own `<dialog>` during OAuth processing,
 * but there is no SDK option to suppress it. We hide the dialog on this page so only
 * our spinner is visible.
 */
const HIDE_PRIVY_DIALOG = (
  <style>{`
    #privy-dialog, #privy-dialog-backdrop, #privy-modal-content {
      display: none !important;
    }
  `}</style>
);

export const LinkAccountContent = () => {
  const { isLoading, error } = useLinkAccountContent();

  if (isLoading) {
    return (
      <div className='flex h-dvh flex-col items-center justify-center bg-background'>
        {HIDE_PRIVY_DIALOG}
        <LoaderIcon className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='flex h-dvh flex-col items-center justify-center gap-3 bg-background'>
      {HIDE_PRIVY_DIALOG}
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
