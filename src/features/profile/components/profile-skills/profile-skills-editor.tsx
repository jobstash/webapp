'use client';

import type { ReactNode } from 'react';

import { LoaderIcon, SearchIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { TAG_COLORS } from '@/features/onboarding/constants';
import type { UserSkill } from '@/features/onboarding/schemas';

import type { useProfileSkillsEditor } from './use-profile-skills-editor';

type EditorProps = ReturnType<typeof useProfileSkillsEditor>;

const DropdownStatus = ({ children }: { children: ReactNode }) => (
  <div className='flex items-center justify-center gap-2 py-4 text-muted-foreground'>
    <LoaderIcon className='size-4 animate-spin' />
    <span>{children}</span>
  </div>
);

interface DropdownContentProps {
  isInitialLoading: boolean;
  isLoading: boolean;
  availableSkills: UserSkill[];
  hasQuery: boolean;
  hasMore: boolean;
  isFetchingMore: boolean;
  loadMore: () => void;
  onAddSkill: (skill: UserSkill) => void;
}

const DropdownContent = ({
  isInitialLoading,
  isLoading,
  availableSkills,
  hasQuery,
  hasMore,
  isFetchingMore,
  loadMore,
  onAddSkill,
}: DropdownContentProps) => {
  if (isInitialLoading) {
    return <DropdownStatus>Loading skills...</DropdownStatus>;
  }

  if (availableSkills.length === 0) {
    if (isLoading) {
      return <DropdownStatus>Searching...</DropdownStatus>;
    }

    if (hasQuery) {
      return (
        <p className='py-4 text-center text-muted-foreground'>
          No skills found
        </p>
      );
    }

    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col py-1',
        isLoading && 'pointer-events-none opacity-50',
      )}
    >
      {availableSkills.map((skill) => (
        <button
          key={skill.id}
          type='button'
          className='px-3 py-2 text-left text-sm transition-colors hover:bg-accent'
          onClick={() => onAddSkill(skill)}
        >
          {skill.name}
        </button>
      ))}

      {hasMore && (
        <button
          type='button'
          className='flex items-center justify-center gap-2 border-t border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50'
          onClick={() => loadMore()}
          disabled={isFetchingMore}
        >
          {isFetchingMore ? (
            <>
              <LoaderIcon className='size-3 animate-spin' />
              Loading...
            </>
          ) : (
            'Load more'
          )}
        </button>
      )}
    </div>
  );
};

export const ProfileSkillsEditor = ({
  isOpen,
  setIsOpen,
  editedSkills,
  isSaving,
  isDropdownOpen,
  searchInputRef,
  skillSearch,
  setSkillSearch,
  availableSkills,
  isInitialLoading,
  isLoading,
  isFetchingMore,
  hasMore,
  loadMore,
  hasQuery,
  suggestedSkills,
  isSuggestedLoading,
  handleInputFocus,
  handleInputBlur,
  handleSearchKeyDown,
  handleDropdownMouseDown,
  handleAddSkill,
  handleRemoveSkill,
  handleSave,
}: EditorProps) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className='flex max-h-[92vh] min-h-[40vh] flex-col overflow-hidden sm:max-w-lg'>
      <DialogHeader className='flex-1 overflow-y-auto'>
        <DialogTitle>Edit Skills</DialogTitle>
        <DialogDescription>
          Search and add skills to your profile
        </DialogDescription>

        <div className='relative py-2'>
          <InputGroup className='h-12'>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              ref={searchInputRef}
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleSearchKeyDown}
              placeholder='Search skills...'
            />
          </InputGroup>

          {isDropdownOpen && (
            <div
              className='absolute top-full left-0 z-50 mt-2 max-h-48 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-lg'
              onMouseDown={handleDropdownMouseDown}
            >
              <DropdownContent
                isInitialLoading={isInitialLoading}
                isLoading={isLoading}
                availableSkills={availableSkills}
                hasQuery={hasQuery}
                hasMore={hasMore}
                isFetchingMore={isFetchingMore}
                loadMore={loadMore}
                onAddSkill={handleAddSkill}
              />
            </div>
          )}
        </div>

        <div className='flex min-h-20 flex-wrap content-start gap-2'>
          {editedSkills.map((skill) => (
            <span
              key={skill.id}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium ring-1',
                TAG_COLORS[skill.colorIndex] ?? TAG_COLORS[0],
              )}
            >
              {skill.name}
              <button
                type='button'
                onClick={() => handleRemoveSkill(skill.id)}
                className='rounded-full opacity-60 transition-opacity hover:opacity-100'
                aria-label='Remove skill'
              >
                <XIcon className='size-3' />
              </button>
            </span>
          ))}

          {isSuggestedLoading ? (
            <span className='inline-flex items-center gap-1.5 py-1 text-sm text-muted-foreground'>
              <LoaderIcon className='size-3 animate-spin' />
              Loading suggestions...
            </span>
          ) : (
            suggestedSkills.map((skill) => (
              <button
                key={skill.id}
                type='button'
                className={cn(
                  'inline-flex items-center rounded-md border border-dashed border-current px-2.5 py-1 text-sm font-medium transition-opacity',
                  isDropdownOpen
                    ? 'pointer-events-none opacity-0'
                    : 'opacity-50 hover:opacity-80',
                  TAG_COLORS[skill.colorIndex] ?? TAG_COLORS[0],
                  'bg-transparent ring-0 hover:bg-transparent',
                )}
                onClick={() => handleAddSkill(skill)}
              >
                {skill.name}
              </button>
            ))
          )}
        </div>
      </DialogHeader>

      <DialogFooter className='shrink-0 border-t border-border pt-4'>
        <Button
          variant='outline'
          onClick={() => setIsOpen(false)}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <LoaderIcon className='size-4 animate-spin' />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
