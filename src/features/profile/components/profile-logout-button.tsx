'use client';

import { useState } from 'react';

import { LogOutIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSession } from '@/features/auth/hooks/use-session';

export const ProfileLogoutButton = () => {
  const { isLoggingOut, logout } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        disabled={isLoggingOut}
        onClick={() => setIsOpen(true)}
        className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-400/10 hover:text-red-400 disabled:pointer-events-none disabled:opacity-50'
      >
        <LogOutIcon className='size-4' />
        {isLoggingOut ? 'Logging out...' : 'Log out'}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Log out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will be redirected to the
              home page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='ghost' disabled={isLoggingOut}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant='destructive'
              disabled={isLoggingOut}
              onClick={logout}
            >
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
