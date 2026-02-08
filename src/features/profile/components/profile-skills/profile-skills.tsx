'use client';

import { PencilIcon, PlusIcon, SquarePenIcon, TagsIcon } from 'lucide-react';

import { MAX_MATCH_SKILLS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { getTagColorIndex } from '@/lib/utils/get-tag-color-index';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TAG_COLORS } from '@/features/onboarding/constants';
import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileEditor } from '@/features/profile/components/profile-editor-provider';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

const SectionHeader = ({
  onEdit,
  count,
}: {
  onEdit?: () => void;
  count?: number;
}) => (
  <div className='flex items-start justify-between'>
    <div>
      <h3 className='text-base font-semibold'>Skills</h3>
      <p className='text-xs text-muted-foreground'>
        Used for matching you with relevant jobs
        {count != null && (
          <span className='ml-1.5 text-muted-foreground/40'>
            ({count}/{MAX_MATCH_SKILLS})
          </span>
        )}
      </p>
    </div>
    {onEdit && (
      <button
        type='button'
        className='mt-0.5 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground/60 transition-colors hover:bg-accent/50 hover:text-muted-foreground'
        onClick={onEdit}
      >
        <SquarePenIcon className='size-3.5' />
        <span className='hidden sm:inline'>Edit</span>
      </button>
    )}
  </div>
);

export const ProfileSkills = () => {
  const { isSessionReady } = useSession();
  const { data: skills, isPending } = useProfileSkills(isSessionReady);
  const { openSkillsEditor } = useProfileEditor();

  if (isPending) {
    return (
      <div className='flex flex-col gap-3'>
        <SectionHeader />
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-20 rounded-md' />
          ))}
        </div>
      </div>
    );
  }

  const hasSkills = skills && skills.length > 0;

  if (!hasSkills) {
    return (
      <div className='flex flex-col gap-3'>
        <SectionHeader />
        <div className='flex flex-col items-center gap-3 py-4'>
          <TagsIcon className='size-8 text-muted-foreground/50' />
          <p className='text-sm text-muted-foreground'>
            Add your skills to unlock personalized job matches
          </p>
          <Button variant='ghost' size='sm' onClick={openSkillsEditor}>
            <PencilIcon className='size-3.5' />
            Add Skills
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <SectionHeader onEdit={openSkillsEditor} count={skills.length} />
      <div className='flex flex-wrap items-center gap-2'>
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
        {skills.length < MAX_MATCH_SKILLS && (
          <button
            type='button'
            className='inline-flex items-center gap-1 rounded-full text-xs text-muted-foreground/30 transition-colors hover:text-muted-foreground'
            onClick={openSkillsEditor}
          >
            <PlusIcon className='size-3' />
            Add skill
          </button>
        )}
      </div>
    </div>
  );
};
