import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { MAX_MATCH_SKILLS } from '@/lib/constants';
import { clientEnv } from '@/lib/env/client';
import { getTagColorIndex } from '@/lib/utils/get-tag-color-index';
import {
  type PopularTagItem,
  type UserSkill,
  resumeParseResponseSchema,
} from '@/features/onboarding/schemas';
import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx';
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const MAX_FILENAME_LENGTH = 255;

const ACCEPTED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const USER_ERROR_MESSAGES: Record<string, string> = {
  'Unsupported file type. Accepted: PDF, DOC, DOCX':
    'Please upload a PDF, DOC, or DOCX file.',
  'File content does not match expected format. Accepted: PDF, DOC, DOCX':
    "This file doesn't appear to be a valid document. Please try a different file.",
  'File too large. Maximum size is 1MB':
    'This file is too large. Please upload a smaller file.',
  'Resume is too long':
    'Your resume is too long. Please shorten it and try again.',
  'Document does not appear to be a resume':
    'This file does not appear to be a resume. Please upload your actual resume.',
  'File too small to identify':
    'This file appears to be empty. Please upload your resume.',
  'File is empty': 'This file appears to be empty. Please upload your resume.',
  'Too many requests. Try again later.':
    'Too many upload attempts. Please wait a few minutes and try again.',
};

const getErrorMessage = (serverError: string): string =>
  USER_ERROR_MESSAGES[serverError] ??
  'Something went wrong while processing your resume. Please try again.';

const validateFile = (file: File): string | null => {
  if (!file.name)
    return 'The file name is missing. Please try a different file.';
  if (file.name.length > MAX_FILENAME_LENGTH)
    return 'The file name is too long. Please shorten it and try again.';
  if (
    file.name.includes('\0') ||
    file.name.includes('..') ||
    file.name.includes('/') ||
    file.name.includes('\\')
  )
    return 'The file name contains invalid characters. Please rename and try again.';
  if (!ACCEPTED_MIME_TYPES.has(file.type))
    return 'Please upload a PDF, DOC, or DOCX file.';
  if (file.size === 0)
    return 'This file appears to be empty. Please upload your resume.';
  if (file.size > MAX_FILE_SIZE)
    return 'This file is too large. Please upload a smaller file.';
  return null;
};

const preventAndStop = (e: DragEvent<HTMLDivElement>): void => {
  e.preventDefault();
  e.stopPropagation();
};

interface UseResumeUploadParams {
  onOpenChange: (open: boolean) => void;
}

export const useResumeUpload = ({ onOpenChange }: UseResumeUploadParams) => {
  const queryClient = useQueryClient();
  const { isSessionReady } = useSession();
  const { data: showcase } = useProfileShowcase(isSessionReady);
  const { data: profileSkills } = useProfileSkills(isSessionReady);

  const [isParsing, setIsParsing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [detectedSkills, setDetectedSkills] = useState<PopularTagItem[]>([]);
  const [includeSkills, setIncludeSkills] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedSkills, setEditedSkills] = useState<UserSkill[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const newSkillCount = detectedSkills.length;
  const existingSkillCount = (profileSkills ?? []).length;
  const isOverCap = existingSkillCount + newSkillCount > MAX_MATCH_SKILLS;
  const skillCount = editedSkills.length;
  const canSave = !isOverCap || skillCount <= MAX_MATCH_SKILLS;

  const handleFile = async (file: File): Promise<void> => {
    setError(null);
    setIsAnalyzed(false);
    setDetectedSkills([]);
    setIncludeSkills(true);
    setResumeId(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFileName(file.name);
    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const parseRes = await fetch('/api/onboarding/resume/parse', {
        method: 'POST',
        body: formData,
      });

      if (!parseRes.ok) {
        const body = await parseRes.json().catch(() => null);
        const serverError = String(body?.error ?? '');
        setError(getErrorMessage(serverError));
        setFileName(null);
        return;
      }

      const json: unknown = await parseRes.json();
      const parsed = resumeParseResponseSchema.parse(json);

      setResumeId(parsed.resumeId);

      // Filter out skills the user already has
      const existingIds = new Set(
        (profileSkills ?? []).map((skill) => skill.id),
      );
      const newSkills = parsed.skills.filter(
        (skill) => !existingIds.has(skill.id),
      );
      setDetectedSkills(newSkills);

      // Build merged skill list for over-cap editing
      const existingAsUserSkills: UserSkill[] = (profileSkills ?? []).map(
        (s) => ({
          id: s.id,
          name: s.name,
          colorIndex: getTagColorIndex(s.id),
          isFromResume: false,
        }),
      );
      const newAsUserSkills: UserSkill[] = newSkills.map((s) => ({
        id: s.id,
        name: s.name,
        colorIndex: getTagColorIndex(s.id),
        isFromResume: true,
      }));
      setEditedSkills([...existingAsUserSkills, ...newAsUserSkills]);

      setIsAnalyzed(true);
    } catch {
      setError(
        'Something went wrong while processing your resume. Please try again.',
      );
      setFileName(null);
    } finally {
      setIsParsing(false);
    }
  };

  const removeSkill = (skillId: string): void => {
    setEditedSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  const save = async (): Promise<void> => {
    if (!resumeId) return;

    setIsSaving(true);
    try {
      // Save CV showcase entry
      const cvEntry = {
        label: 'CV',
        url: `${clientEnv.FRONTEND_URL}/api/resume/${resumeId}`,
      };
      const existingItems = (showcase ?? []).filter(
        (item) => item.label !== 'CV',
      );
      const mergedShowcase = [...existingItems, cvEntry];

      const saveRes = await fetch('/api/profile/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showcase: mergedShowcase }),
      });

      if (!saveRes.ok) throw new Error('Failed to save showcase');

      await queryClient.invalidateQueries({ queryKey: ['profile-showcase'] });

      // Save skills: over-cap uses curated editedSkills, under-cap merges
      if (isOverCap) {
        const skills = editedSkills.map((s) => ({ id: s.id, name: s.name }));

        const res = await fetch('/api/onboarding/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skills,
            socials: [],
            email: null,
            resume: null,
          }),
        });

        if (!res.ok) throw new Error('Failed to save skills');

        await queryClient.invalidateQueries({ queryKey: ['profile-skills'] });
      } else if (includeSkills && detectedSkills.length > 0) {
        const existingSkills = (profileSkills ?? []).map((s) => ({
          id: s.id,
          name: s.name,
        }));
        const newSkills = detectedSkills.map((s) => ({
          id: s.id,
          name: s.name,
        }));
        const mergedSkills = [...existingSkills, ...newSkills];

        const res = await fetch('/api/onboarding/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skills: mergedSkills,
            socials: [],
            email: null,
            resume: null,
          }),
        });

        if (!res.ok) throw new Error('Failed to save skills');

        await queryClient.invalidateQueries({ queryKey: ['profile-skills'] });
      }

      handleOpenChange(false);
    } finally {
      setIsSaving(false);
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

  const handleOpenFilePicker = (): void => {
    fileInputRef.current?.click();
  };

  const reset = (): void => {
    setError(null);
    setIsAnalyzed(false);
    setFileName(null);
    setIsParsing(false);
    setIsDragActive(false);
    setResumeId(null);
    setDetectedSkills([]);
    setIncludeSkills(true);
    setIsSaving(false);
    setEditedSkills([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenChange = (open: boolean): void => {
    if (!open) reset();
    onOpenChange(open);
  };

  return {
    isParsing,
    isDragActive,
    error,
    isAnalyzed,
    fileName,
    acceptedFileTypes: ACCEPTED_FILE_TYPES,
    fileInputRef,
    includeSkills,
    setIncludeSkills,
    isSaving,
    newSkillCount,
    isOverCap,
    editedSkills,
    removeSkill,
    skillCount,
    canSave,
    save,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleOpenFilePicker,
    handleOpenChange,
  };
};
