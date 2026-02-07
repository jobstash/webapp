'use client';

import { PencilIcon, TagsIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getTagColorIndex } from '@/lib/utils/get-tag-color-index';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TAG_COLORS } from '@/features/onboarding/constants';
import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

import { ProfileSkillsEditor } from './profile-skills-editor';
import { useProfileSkillsEditor } from './use-profile-skills-editor';

export const ProfileSkills = () => {
  const { isSessionReady } = useSession();
  const { data: skills, isPending } = useProfileSkills(isSessionReady);
  const editor = useProfileSkillsEditor(skills ?? []);

  if (isPending) {
    return (
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Skills</h2>
        </div>
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-20 rounded-md' />
          ))}
        </div>
      </div>
    );
  }

  const hasSkills = skills && skills.length > 0;

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Skills</h2>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.setIsOpen(true)}
        >
          <PencilIcon className='size-3.5' />
          {hasSkills ? 'Edit' : 'Add skills'}
        </Button>
      </div>

      {hasSkills ? (
        <div className='flex flex-wrap gap-2'>
          {skills.map((skill) => (
            <span
              key={skill.id}
              className={cn(
                'inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium ring-1',
                TAG_COLORS[getTagColorIndex(skill.id)] ?? TAG_COLORS[0],
              )}
            >
              {skill.name}
            </span>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8'>
          <TagsIcon className='size-8 text-muted-foreground/50' />
          <p className='text-sm text-muted-foreground'>
            No skills yet — add your first skill
          </p>
        </div>
      )}

      <ProfileSkillsEditor {...editor} />
    </div>
  );
};
