import { useState } from 'react';

import { useSession } from '@/features/auth/hooks/use-session';

export const useProfileLogoutButton = () => {
  const { isLoggingOut, logout } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    if (isLoggingOut) return;
    setIsOpen(open);
  };

  const handleOpen = () => setIsOpen(true);

  return { isLoggingOut, isOpen, onOpenChange, handleOpen, logout };
};
