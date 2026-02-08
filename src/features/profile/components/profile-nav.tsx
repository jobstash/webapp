'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { PROFILE_NAV_ITEMS } from '@/features/profile/constants';

const isActive = (pathname: string, href: string) =>
  href === '/profile' ? pathname === '/profile' : pathname.startsWith(href);

export const ProfileNav = () => {
  const pathname = usePathname();

  return (
    <nav className='flex gap-1'>
      {PROFILE_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-neutral-800 text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-neutral-800/50 hover:text-foreground/80',
            )}
          >
            <Icon className='size-4' />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
