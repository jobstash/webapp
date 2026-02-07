'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { LinkWithLoader } from '@/components/link-with-loader';
import { PROFILE_NAV_ITEMS } from '@/features/profile/constants';

export const ProfileMobileNav = () => {
  const pathname = usePathname();

  return (
    <div className='mb-4 flex gap-1 overflow-x-auto rounded-2xl border border-neutral-800/50 bg-sidebar p-2 lg:hidden'>
      {PROFILE_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive =
          href === '/profile'
            ? pathname === '/profile'
            : pathname.startsWith(href);

        return (
          <LinkWithLoader
            key={href}
            href={href}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )}
          >
            <Icon className='size-3.5' />
            {label}
          </LinkWithLoader>
        );
      })}
    </div>
  );
};
