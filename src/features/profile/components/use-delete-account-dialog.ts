import { useState } from 'react';

import type { MessageResponse } from '@/lib/schemas';

const DEFAULT_ERROR = 'Failed to delete account';

const getErrorMessage = (data: MessageResponse | { error: string }): string => {
  if ('error' in data) return data.error;
  if ('message' in data) return data.message;
  return DEFAULT_ERROR;
};

interface UseDeleteAccountDialogParams {
  logout: () => Promise<void>;
}

export const useDeleteAccountDialog = ({
  logout,
}: UseDeleteAccountDialogParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onOpenChange = (open: boolean) => {
    if (isDeleting) return;
    setIsOpen(open);
    if (!open) setError(null);
  };

  const onConfirm = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch('/api/profile/delete', { method: 'POST' });
      const data = (await res.json()) as MessageResponse | { error: string };

      if (!res.ok || !('success' in data) || !data.success) {
        setError(getErrorMessage(data));
        setIsDeleting(false);
        return;
      }

      await logout();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsDeleting(false);
    }
  };

  return { isOpen, isDeleting, error, onOpenChange, onConfirm };
};
