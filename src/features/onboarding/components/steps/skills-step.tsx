'use client';

import type { ReactNode } from 'react';

import { LoaderIcon, SearchIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { TAG_COLORS } from '@/features/onboarding/constants';
import type { UserSkill } from '@/features/onboarding/schemas';

import { useSkillsStep } from './use-skills-step';

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

export const SkillsStep = () => {
  const {
    data,
    isDropdownOpen,
    skillSearch,
    searchInputRef,
    availableSkills,
    isInitialLoading,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    hasQuery,
    suggestedSkills,
    subtext,
    setSkillSearch,
    handleInputFocus,
    handleInputBlur,
    handleSearchKeyDown,
    handleDropdownMouseDown,
    handleAddSkill,
    handleRemoveSkill,
    nextStep,
    prevStep,
  } = useSkillsStep();

  const hasSkills = data.selectedSkills.length > 0;

  return (
    <div className='flex flex-col gap-6 sm:gap-8'>
      <section className='flex flex-col gap-4'>
        <h2 className='text-xl font-semibold'>Select Your Skills</h2>

        <Field>
          <div className='relative'>
            <InputGroup className='h-12'>
              <InputGroupAddon>
                {isLoading ? (
                  <LoaderIcon className='animate-spin' />
                ) : (
                  <SearchIcon />
                )}
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
                className='absolute top-full left-0 z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-lg'
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
          <FieldDescription>{subtext}</FieldDescription>
        </Field>

        <div className='flex min-h-20 flex-wrap content-start gap-2'>
          {data.selectedSkills.map((skill) => (
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

          {suggestedSkills.map((skill) => (
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
          ))}
        </div>
      </section>

      <div className='flex flex-col gap-4'>
        <div className='h-px w-full bg-border' />
        <div className='flex items-center justify-between'>
          <Button variant='ghost' onClick={prevStep}>
            Back
          </Button>
          <Button variant={hasSkills ? 'default' : 'ghost'} onClick={nextStep}>
            {hasSkills ? 'Continue' : 'Skip'}
          </Button>
        </div>
      </div>
    </div>
  );
};
