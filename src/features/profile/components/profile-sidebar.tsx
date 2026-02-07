'use client';

import { cn } from '@/lib/utils';
import { LinkWithLoader } from '@/components/link-with-loader';

import { ProfileStrengthCard } from './profile-strength-card';
import { useProfileSidebar } from './use-profile-sidebar';

export const ProfileSidebar = () => {
  const { navItems } = useProfileSidebar();

  return (
    <nav className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
        <span className='font-medium'>Your Profile</span>
        {navItems.map(({ label, href, icon: Icon, isActive }) => (
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
        ))}
      </div>

      <ProfileStrengthCard />
    </nav>
  );
};
