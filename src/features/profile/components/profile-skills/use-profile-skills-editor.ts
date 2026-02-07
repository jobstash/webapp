import { type KeyboardEvent, type MouseEvent, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { getTagColorIndex } from '@/lib/utils/get-tag-color-index';
import { useSkillsSearch } from '@/features/onboarding/hooks/use-skills-search';
import { useSuggestedSkills } from '@/features/onboarding/hooks/use-suggested-skills';
import type { UserSkill } from '@/features/onboarding/schemas';
import type { ProfileSkill } from '@/features/profile/schemas';

const toUserSkill = (skill: ProfileSkill): UserSkill => ({
  id: skill.id,
  name: skill.name,
  colorIndex: getTagColorIndex(skill.id),
  isFromResume: false,
});

export const useProfileSkillsEditor = (currentSkills: ProfileSkill[]) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editedSkills, setEditedSkills] = useState<UserSkill[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedIds = new Set(editedSkills.map((s) => s.id));
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
  } = useSkillsSearch(selectedIds, isDropdownOpen && isOpen);
  const { suggestedSkills, isLoading: isSuggestedLoading } =
    useSuggestedSkills(selectedIds);

  const handleOpen = () => {
    setEditedSkills(currentSkills.map(toUserSkill));
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSkillSearch('');
    setIsDropdownOpen(false);
  };

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
    setEditedSkills((prev) => [...prev, skill]);
    setSkillSearch('');
    setIsDropdownOpen(false);
    searchInputRef.current?.blur();
  };

  const handleRemoveSkill = (skillId: string) => {
    setEditedSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/onboarding/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: editedSkills.map((s) => ({ id: s.id, name: s.name })),
          socials: [],
          email: null,
          resume: null,
        }),
      });

      if (!res.ok) throw new Error('Failed to save skills');

      await queryClient.invalidateQueries({ queryKey: ['profile-skills'] });
      handleClose();
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isOpen,
    setIsOpen: (open: boolean) => {
      if (open) handleOpen();
      else handleClose();
    },
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
  };
};
