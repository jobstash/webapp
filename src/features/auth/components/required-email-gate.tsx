'use client';

import { useState } from 'react';

import { useLinkAccount, usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderIcon, MailIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createSession } from '@/features/auth/lib/create-session';
import { SESSION_KEY } from '@/features/auth/constants';
import { useSession } from '@/features/auth/hooks/use-session';

export const RequiredEmailGate = ({ children }: React.PropsWithChildren) => {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const { isSessionReady, hasVerifiedEmail } = useSession();
  const queryClient = useQueryClient();
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState(false);
  const { linkEmail } = useLinkAccount({
    onSuccess: () => {
      setError(false);
      void (async () => {
        const accessToken = await getAccessToken();
        if (accessToken) {
          const session = await createSession(accessToken);
          queryClient.setQueryData(SESSION_KEY, session);
        }
        setIsLinking(false);
      })().catch(() => {
        setIsLinking(false);
        setError(true);
      });
    },
    onError: () => {
      setIsLinking(false);
      setError(true);
    },
  });

  const open =
    ready && authenticated && isSessionReady && hasVerifiedEmail === false;

  return (
    <>
      {children}
      <Dialog open={open}>
        <DialogContent
          showCloseButton={false}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <div className='mb-1 flex size-9 items-center justify-center rounded-lg bg-accent'>
              <MailIcon className='size-4' />
            </div>
            <DialogTitle>Add your email</DialogTitle>
            <DialogDescription>
              Recruiters need a way to reach you.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <p className='text-sm text-destructive'>Email was not linked.</p>
          )}
          <Button
            onClick={() => {
              setIsLinking(true);
              setError(false);
              linkEmail();
            }}
            disabled={isLinking}
          >
            {isLinking && <LoaderIcon className='size-4 animate-spin' />}
            Add email
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
