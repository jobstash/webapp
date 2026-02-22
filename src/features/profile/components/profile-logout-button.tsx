'use client';

import { LoaderIcon, LogOutIcon } from 'lucide-react';

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

import { useProfileLogoutButton } from './use-profile-logout-button';

export const ProfileLogoutButton = () => {
  const { isLoggingOut, isOpen, onOpenChange, handleOpen, logout } =
    useProfileLogoutButton();

  return (
    <>
      <button
        type='button'
        disabled={isLoggingOut}
        onClick={handleOpen}
        className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-400/10 hover:text-red-400 disabled:pointer-events-none disabled:opacity-50'
      >
        {isLoggingOut && <LoaderIcon className='size-4 animate-spin' />}
        {!isLoggingOut && <LogOutIcon className='size-4' />}
        Log out
      </button>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              {isLoggingOut && <LoaderIcon className='size-4 animate-spin' />}
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
