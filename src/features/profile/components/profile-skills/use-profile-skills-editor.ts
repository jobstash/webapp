'use client';

import { type KeyboardEvent, type MouseEvent, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { SKILL_ERROR_THRESHOLD, getSkillStatus } from '@/lib/constants';
import { getTagColorIndex } from '@/lib/utils/get-tag-color-index';
import { useSkillsSearch } from '@/features/profile/hooks/use-skills-search';
import { useSuggestedSkills } from '@/features/profile/hooks/use-suggested-skills';
import type { ProfileSkill, UserSkill } from '@/features/profile/schemas';
import { uniqueSkills } from '../../unique-skills';

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
  } = useSkillsSearch(editedSkills, isDropdownOpen && isOpen);
  const { suggestedSkills, isLoading: isSuggestedLoading } =
    useSuggestedSkills(editedSkills);

  const handleOpen = () => {
    setEditedSkills(uniqueSkills(currentSkills).map(toUserSkill));
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

  const preventBlur = (e: MouseEvent<HTMLDivElement>) => e.preventDefault();

  const skillStatus = getSkillStatus(editedSkills.length);
  const isAtErrorCap = skillStatus === 'error';

  const handleAddSkill = (skill: UserSkill) => {
    setEditedSkills((prev) =>
      prev.length >= SKILL_ERROR_THRESHOLD
        ? prev
        : uniqueSkills([...prev, skill]),
    );
    setSkillSearch('');
    setIsDropdownOpen(false);
    searchInputRef.current?.blur();
  };

  const handleRemoveSkill = (skillId: string) => {
    setEditedSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  const handleSave = async () => {
    if (isAtErrorCap) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile/sync', {
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

      trackEvent(GA_EVENT.SKILLS_SAVED, {
        skill_count: editedSkills.length,
        source: 'editor',
      });

      await queryClient.invalidateQueries({ queryKey: ['profile-skills'] });
      await queryClient.invalidateQueries({ queryKey: ['recommended-jobs'] });
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
    handleDropdownMouseDown: preventBlur,
    skillStatus,
    isAtErrorCap,
    handleAddSkill,
    handleRemoveSkill,
    handleSave,
  };
};
