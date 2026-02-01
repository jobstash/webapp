'use client';

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

import { useDeleteAccountDialog } from './use-delete-account-dialog';

interface DeleteAccountDialogProps {
  logout: () => Promise<void>;
}

export const DeleteAccountDialog = ({ logout }: DeleteAccountDialogProps) => {
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
            <Button variant='outline' disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant='destructive'
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? 'Deleting...' : 'Delete account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
