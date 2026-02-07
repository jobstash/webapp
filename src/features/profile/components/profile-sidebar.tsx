'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { LinkWithLoader } from '@/components/link-with-loader';
import { PROFILE_NAV_ITEMS } from '@/features/profile/constants';

import { ProfileCompleteness } from './profile-completeness';
import { ProfileExpertStatus } from './profile-expert-status';

export const ProfileSidebar = () => {
  const pathname = usePathname();

  return (
    <nav className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1 rounded-2xl border border-neutral-800/50 bg-sidebar p-2'>
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
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )}
            >
              <Icon className='size-4' />
              {label}
            </LinkWithLoader>
          );
        })}
      </div>

      <ProfileExpertStatus />
      <ProfileCompleteness />
    </nav>
  );
};
