'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { PROFILE_NAV_ITEMS } from '@/features/profile/constants';

import { ProfileStrengthCard } from './profile-strength-card';

const isActive = (pathname: string, href: string): boolean =>
  href === '/profile' ? pathname === '/profile' : pathname.startsWith(href);

export const ProfileSidebar = () => {
  const pathname = usePathname();

  return (
    <div className='flex flex-col gap-4'>
      <nav className='rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
        <h3 className='mb-3 font-medium'>Your Profile</h3>
        <div className='flex flex-col gap-1'>
          {PROFILE_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-neutral-800 text-foreground'
                    : 'text-muted-foreground hover:bg-neutral-800/50 hover:text-foreground/80',
                )}
              >
                <Icon className='size-4' />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <ProfileStrengthCard />
    </div>
  );
};
