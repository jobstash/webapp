import { useState } from 'react';

import { GA_EVENT, trackEvent } from '@/lib/analytics';

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
      const data = (await res.json()) as Record<string, unknown>;

      if (!res.ok || !data.success) {
        const message =
          (data.error as string) ??
          (data.message as string) ??
          'Failed to delete account';
        setError(message);
        setIsDeleting(false);
        return;
      }

      trackEvent(GA_EVENT.ACCOUNT_DELETED, {});
      await logout();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsDeleting(false);
    }
  };

  return { isOpen, isDeleting, error, onOpenChange, onConfirm };
};
