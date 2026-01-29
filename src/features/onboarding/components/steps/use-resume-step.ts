import { type DragEvent, type ChangeEvent, useState } from 'react';

import { getColorIndex } from '@/features/onboarding/constants';
import { useOnboarding } from '@/features/onboarding/hooks/use-onboarding';
import {
  type UserSkill,
  resumeParseResponseSchema,
} from '@/features/onboarding/schemas';

const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx';

const preventAndStop = (e: DragEvent<HTMLDivElement>): void => {
  e.preventDefault();
  e.stopPropagation();
};

export const useResumeStep = () => {
  const {
    data,
    setResumeFile,
    setParsedResume,
    setSelectedSkills,
    nextStep,
    prevStep,
  } = useOnboarding();

  const [isParsing, setIsParsing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const hasFile = data.resumeFile !== null;

  const handleFile = async (file: File): Promise<void> => {
    setResumeFile(file);
    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/onboarding/resume/parse', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) return;

      const json: unknown = await res.json();
      const parsed = resumeParseResponseSchema.parse(json);

      const skills: UserSkill[] = parsed.skills.map((tag) => ({
        id: tag.normalizedName,
        name: tag.name,
        colorIndex: getColorIndex(tag.normalizedName),
        isFromResume: true,
      }));

      setParsedResume({ fileName: parsed.fileName, skills });
      setSelectedSkills(skills);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    preventAndStop(e);
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    preventAndStop(e);
    setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    preventAndStop(e);
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemoveFile = (): void => {
    setResumeFile(null);

    const resumeSkillIds = new Set(
      data.parsedResume?.skills.map((s) => s.id) ?? [],
    );
    setSelectedSkills(
      data.selectedSkills.filter((s) => !resumeSkillIds.has(s.id)),
    );

    setParsedResume(null);
  };

  return {
    resumeFile: data.resumeFile,
    parsedResume: data.parsedResume,
    isParsing,
    isDragActive,
    hasFile,
    acceptedFileTypes: ACCEPTED_FILE_TYPES,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleRemoveFile,
    nextStep,
    prevStep,
  };
};
