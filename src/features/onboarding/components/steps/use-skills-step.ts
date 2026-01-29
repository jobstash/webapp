import { type KeyboardEvent, type MouseEvent, useState, useRef } from 'react';

import { SUGGESTED_SKILLS } from '@/features/onboarding/constants';
import { useOnboarding } from '@/features/onboarding/hooks/use-onboarding';
import { useSkillsSearch } from '@/features/onboarding/hooks/use-skills-search';
import type { UserSkill } from '@/features/onboarding/schemas';

export const useSkillsStep = () => {
  const { data, setSelectedSkills, nextStep, prevStep } = useOnboarding();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedIds = new Set(data.selectedSkills.map((s) => s.id));
  const {
    searchValue: skillSearch,
    setSearchValue: setSkillSearch,
    isInitialLoading,
    isLoading,
    isFetchingMore,
    availableSkills,
    hasMore,
    loadMore,
    hasQuery,
  } = useSkillsSearch(selectedIds, isDropdownOpen);

  const handleInputFocus = () => setIsDropdownOpen(true);
  const handleInputBlur = () => setIsDropdownOpen(false);

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && isDropdownOpen) {
      e.preventDefault();
      setSkillSearch('');
      setIsDropdownOpen(false);
      searchInputRef.current?.blur();
    }
  };

  const handleDropdownMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAddSkill = (skill: UserSkill) => {
    setSelectedSkills([...data.selectedSkills, skill]);
    setSkillSearch('');
    setIsDropdownOpen(false);
    searchInputRef.current?.blur();
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(data.selectedSkills.filter((s) => s.id !== skillId));
  };

  const suggestedSkills = SUGGESTED_SKILLS.filter(
    (s) => !selectedIds.has(s.id),
  );

  const subtext = data.parsedResume
    ? `We pulled ${data.parsedResume.skills.length} skills from your resume. Add more or remove any that don't fit.`
    : 'Search or pick from available skills/tags for jobs.';

  return {
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
  };
};
