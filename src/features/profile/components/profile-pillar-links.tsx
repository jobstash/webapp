'use client';

import { ArrowRightIcon, BriefcaseIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getTagColorIndex } from '@/lib/utils/get-tag-color-index';
import { Skeleton } from '@/components/ui/skeleton';
import { LinkWithLoader } from '@/components/link-with-loader';
import { TAG_COLORS } from '@/features/onboarding/constants';
import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

const MAX_LINKS = 8;

export const ProfilePillarLinks = () => {
  const { isSessionReady } = useSession();
  const { data: skills, isPending } = useProfileSkills(isSessionReady);

  if (isPending) {
    return (
      <div className='flex flex-col gap-3'>
        <h2 className='text-lg font-semibold'>Browse Jobs by Skill</h2>
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-28 rounded-md' />
          ))}
        </div>
      </div>
    );
  }

  if (!skills || skills.length === 0) return null;

  const links = skills.slice(0, MAX_LINKS).map((skill) => ({
    href: `/t-${skill.normalizedName}`,
    label: `${skill.name} Jobs`,
    colorIndex: getTagColorIndex(skill.id),
  }));

  return (
    <div className='flex flex-col gap-3'>
      <h2 className='text-lg font-semibold'>Browse Jobs by Skill</h2>
      <div className='flex flex-wrap gap-2'>
        {links.map((link) => (
          <LinkWithLoader
            key={link.href}
            href={link.href}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium ring-1',
              'transition-opacity hover:opacity-80',
              TAG_COLORS[link.colorIndex] ?? TAG_COLORS[0],
            )}
          >
            <BriefcaseIcon className='size-3' />
            {link.label}
          </LinkWithLoader>
        ))}
      </div>

      <LinkWithLoader
        href='/'
        className='inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
      >
        View all jobs
        <ArrowRightIcon className='size-3' />
      </LinkWithLoader>
    </div>
  );
};
