import { useState } from 'react';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { useSession } from '@/features/auth/hooks/use-session';

export const useProfileLogoutButton = () => {
  const { isLoggingOut, logout } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    if (isLoggingOut) return;
    setIsOpen(open);
  };

  const handleOpen = () => setIsOpen(true);

  const handleLogout = () => {
    trackEvent(GA_EVENT.LOGOUT, {});
    logout();
  };

  return {
    isLoggingOut,
    isOpen,
    onOpenChange,
    handleOpen,
    logout: handleLogout,
  };
};
