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
import { useSession } from '@/features/auth/hooks/use-session';

import { useDeleteAccountDialog } from './use-delete-account-dialog';

export const DeleteAccountDialog = () => {
  const { logout } = useSession();
  const { isOpen, isDeleting, error, onOpenChange, onConfirm } =
    useDeleteAccountDialog({ logout });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant='destructive' className='w-fit'>
          Delete account
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={!isDeleting}>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All your data will be
            deleted.
          </DialogDescription>
        </DialogHeader>

        {error && <p className='text-sm text-destructive'>{error}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='ghost' disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant='destructive'
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting && <LoaderIcon className='size-4 animate-spin' />}
            Delete account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
