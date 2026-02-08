'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { PROFILE_NAV_ITEMS } from '@/features/profile/constants';

const isActive = (pathname: string, href: string): boolean =>
  href === '/profile' ? pathname === '/profile' : pathname.startsWith(href);

export const ProfileBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className='fixed inset-x-0 bottom-0 z-50 border-t border-neutral-900 bg-background/40 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden'>
      <div className='flex'>
        {PROFILE_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors',
                active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/80',
              )}
            >
              <Icon className='size-5' />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
