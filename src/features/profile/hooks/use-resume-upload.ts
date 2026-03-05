'use client';

import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { SKILL_ERROR_THRESHOLD, getSkillStatus } from '@/lib/constants';
import { clientEnv } from '@/lib/env/client';
import { getTagColorIndex } from '@/lib/utils/get-tag-color-index';
import type {
  PopularTagItem,
  Social,
  UserSkill,
} from '@/features/profile/schemas';
import { useSession } from '@/features/auth/hooks/use-session';
import { JOB_APPLY_STATUS_KEY } from '@/features/jobs/components/job-details/use-job-apply-status';
import {
  getSocialLabel,
  SOCIAL_URL_TEMPLATES,
} from '@/features/profile/constants';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import { useProfileSkills } from '@/features/profile/hooks/use-profile-skills';

const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILENAME_LENGTH = 255;

const ACCEPTED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const EXTENSION_TO_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

/** Use file.type when available, fall back to extension (iOS often reports empty type) */
const getFileMimeType = (file: File): string => {
  if (file.type) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSION_TO_MIME[ext] ?? '';
};

const USER_ERROR_MESSAGES: Record<string, string> = {
  'Unsupported file type. Accepted: PDF, DOC, DOCX':
    'Please upload a PDF, DOC, or DOCX file.',
  'File content does not match expected format. Accepted: PDF, DOC, DOCX':
    "This file doesn't appear to be a valid document. Please try a different file.",
  'File too large. Maximum size is 5MB':
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
  if (!ACCEPTED_MIME_TYPES.has(getFileMimeType(file)))
    return 'Please upload a PDF, DOC, or DOCX file.';
  if (file.size === 0)
    return 'This file appears to be empty. Please upload your resume.';
  if (file.size > MAX_FILE_SIZE)
    return 'This file is too large. Please upload a smaller file.';
  return null;
};

interface ResumeParseResponse {
  resumeId: string;
  fileName: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: PopularTagItem[];
  socials: Social[];
}

const preventAndStop = (e: DragEvent<HTMLDivElement>): void => {
  e.preventDefault();
  e.stopPropagation();
};

const syncSkills = async (
  skills: { id: string; name: string }[],
): Promise<void> => {
  const res = await fetch('/api/profile/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills, socials: [], email: null, resume: null }),
  });
  if (!res.ok) throw new Error('Failed to save skills');
};

const toIdName = (s: { id: string; name: string }) => ({
  id: s.id,
  name: s.name,
});

const getSkillsToSync = (
  isOverCap: boolean,
  editedSkills: { id: string; name: string }[],
  detectedSkills: { id: string; name: string }[],
  excludedSkillIds: Set<string>,
  profileSkills: { id: string; name: string }[],
): { id: string; name: string }[] | null => {
  if (isOverCap) return editedSkills.map(toIdName);

  if (detectedSkills.length === 0) return null;

  const includedNew = detectedSkills.filter((s) => !excludedSkillIds.has(s.id));
  if (includedNew.length === 0) return null;

  return [...profileSkills.map(toIdName), ...includedNew.map(toIdName)];
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
  const [excludedSkillIds, setExcludedSkillIds] = useState<Set<string>>(
    new Set(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [editedSkills, setEditedSkills] = useState<UserSkill[]>([]);
  const [resumeEmail, setResumeEmail] = useState<string | null>(null);
  const [resumePhone, setResumePhone] = useState<string | null>(null);
  const [resumeSocials, setResumeSocials] = useState<Social[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const newSkillCount = detectedSkills.length;
  const existingSkillCount = (profileSkills ?? []).length;
  const isOverCap = existingSkillCount + newSkillCount > SKILL_ERROR_THRESHOLD;
  const canSave = !isOverCap || editedSkills.length <= SKILL_ERROR_THRESHOLD;
  const skillStatus = getSkillStatus(editedSkills.length);

  const detectedSkillChips = detectedSkills.map((s) => ({
    id: s.id,
    name: s.name,
    colorIndex: getTagColorIndex(s.id),
    isExcluded: excludedSkillIds.has(s.id),
  }));

  const handleFile = async (file: File): Promise<void> => {
    setError(null);
    setIsAnalyzed(false);
    setDetectedSkills([]);
    setExcludedSkillIds(new Set());
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

      const parseRes = await fetch('/api/profile/resume/parse', {
        method: 'POST',
        body: formData,
      });

      if (!parseRes.ok) {
        const body = await parseRes.json().catch(() => null);
        const serverError = String(body?.error ?? '');
        trackEvent(GA_EVENT.RESUME_PARSE_FAILED, {
          resume_parse_error: serverError,
        });
        setError(getErrorMessage(serverError));
        setFileName(null);
        return;
      }

      const parsed = (await parseRes.json()) as ResumeParseResponse;

      setResumeId(parsed.resumeId);
      setResumeEmail(parsed.email);
      setResumePhone(parsed.phone);
      setResumeSocials(parsed.socials);

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

  const toggleSkill = (skillId: string): void => {
    setExcludedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) next.delete(skillId);
      else next.add(skillId);
      return next;
    });
  };

  const save = async (): Promise<void> => {
    if (!resumeId) return;

    setIsSaving(true);
    setError(null);
    try {
      // Build showcase entries from resume data
      const newEntries: { label: string; url: string }[] = [
        {
          label: 'CV',
          url: `${clientEnv.FRONTEND_URL}/api/resume/${resumeId}`,
        },
      ];

      if (resumeEmail) {
        newEntries.push({ label: 'Email', url: resumeEmail });
      }

      if (resumePhone) {
        newEntries.push({ label: 'Phone', url: resumePhone });
      }

      for (const { kind, handle } of resumeSocials) {
        if (!handle) continue;
        const template = SOCIAL_URL_TEMPLATES[kind];
        if (!template) continue;
        newEntries.push({
          label: getSocialLabel(kind),
          url: template(handle),
        });
      }

      // Deduplicate: remove existing items whose labels match new entries
      const newLabels = new Set(newEntries.map((e) => e.label));
      const existingItems = (showcase ?? []).filter(
        (item) => !newLabels.has(item.label),
      );
      const mergedShowcase = [...existingItems, ...newEntries];

      const saveRes = await fetch('/api/profile/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showcase: mergedShowcase }),
      });

      if (!saveRes.ok) throw new Error('Failed to save showcase');

      await queryClient.invalidateQueries({ queryKey: ['profile-showcase'] });
      queryClient.invalidateQueries({ queryKey: [JOB_APPLY_STATUS_KEY] });

      const skillsToSync = getSkillsToSync(
        isOverCap,
        editedSkills,
        detectedSkills,
        excludedSkillIds,
        profileSkills ?? [],
      );

      if (skillsToSync) {
        await syncSkills(skillsToSync);
        await queryClient.invalidateQueries({ queryKey: ['profile-skills'] });
      }

      trackEvent(GA_EVENT.RESUME_UPLOADED, {
        skill_count: skillsToSync?.length ?? 0,
      });

      handleOpenChange(false);
    } catch {
      setError(
        'Something went wrong while saving your resume data. Please try again.',
      );
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
    setExcludedSkillIds(new Set());
    setIsSaving(false);
    setEditedSkills([]);
    setResumeEmail(null);
    setResumePhone(null);
    setResumeSocials([]);
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
    toggleSkill,
    detectedSkillChips,
    isSaving,
    newSkillCount,
    isOverCap,
    editedSkills,
    removeSkill,
    skillStatus,
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
