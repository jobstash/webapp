'use client';

import { usePathname } from 'next/navigation';

import { PROFILE_NAV_ITEMS } from '@/features/profile/constants';

export const useProfileSidebar = () => {
  const pathname = usePathname();

  const navItems = PROFILE_NAV_ITEMS.map((item) => ({
    ...item,
    isActive:
      item.href === '/profile'
        ? pathname === item.href
        : pathname.startsWith(item.href),
  }));

  return { navItems };
};
