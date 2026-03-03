'use client';

import { LoaderIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useProfileLogoutButton } from './use-profile-logout-button';

export const SettingsLogoutButton = () => {
  const { isLoggingOut, isOpen, onOpenChange, logout } =
    useProfileLogoutButton();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant='secondary' className='w-fit'>
          Log out
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Log out</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out? You will be redirected to the home
            page.
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
  );
};
