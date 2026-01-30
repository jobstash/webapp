import { type DragEvent, type ChangeEvent, useState, useRef } from 'react';

import { getColorIndex } from '@/features/onboarding/constants';
import { useOnboarding } from '@/features/onboarding/hooks/use-onboarding';
import {
  type UserSkill,
  resumeParseResponseSchema,
} from '@/features/onboarding/schemas';

const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
  'File too large. Maximum size is 10MB':
    'This file is too large. Please upload a file under 10MB.',
  'File too small to identify':
    'This file appears to be empty. Please upload your resume.',
  'Invalid filename':
    'The file name contains invalid characters. Please rename and try again.',
  'Filename too long':
    'The file name is too long. Please shorten it and try again.',
  'File is empty': 'This file appears to be empty. Please upload your resume.',
  'Missing filename': 'The file name is missing. Please try a different file.',
  'Invalid form data':
    'Something went wrong with the upload. Please try again.',
  'Missing or invalid file':
    'No file was detected. Please select a file and try again.',
  'Too many requests. Try again later.':
    'Too many upload attempts. Please wait a few minutes and try again.',
  'Too many concurrent uploads. Please wait for current uploads to finish.':
    'Your previous upload is still processing. Please wait for it to finish.',
};

const getErrorMessage = (serverError: string): string =>
  USER_ERROR_MESSAGES[serverError] ??
  'Something went wrong while processing your resume. Please try again.';

const validateFile = (file: File): string | null => {
  if (!ACCEPTED_MIME_TYPES.has(file.type)) {
    return 'Please upload a PDF, DOC, or DOCX file.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'This file is too large. Please upload a file under 10MB.';
  }
  return null;
};

const preventAndStop = (e: DragEvent<HTMLDivElement>): void => {
  e.preventDefault();
  e.stopPropagation();
};

const mapParsedSkills = (
  skills: { name: string; normalizedName: string }[],
): UserSkill[] =>
  skills.map((tag) => ({
    id: tag.normalizedName,
    name: tag.name,
    colorIndex: getColorIndex(tag.normalizedName),
    isFromResume: true,
  }));

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
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasFile = data.resumeFile !== null;

  const handleFile = async (file: File): Promise<void> => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setResumeFile(file);
    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/onboarding/resume/parse', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const serverError =
          body && typeof body === 'object' && 'error' in body
            ? String(body.error)
            : '';
        setError(getErrorMessage(serverError));
        setResumeFile(null);
        return;
      }

      const json: unknown = await res.json();
      const parsed = resumeParseResponseSchema.parse(json);

      const skills = mapParsedSkills(parsed.skills);

      setParsedResume({ fileName: parsed.fileName, skills });
      setSelectedSkills(skills);
    } catch {
      setError(
        'Something went wrong while processing your resume. Please try again.',
      );
      setResumeFile(null);
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

  const handleOpenFilePicker = (): void => {
    fileInputRef.current?.click();
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

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    resumeFile: data.resumeFile,
    parsedResume: data.parsedResume,
    isParsing,
    isDragActive,
    hasFile,
    error,
    acceptedFileTypes: ACCEPTED_FILE_TYPES,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleOpenFilePicker,
    handleRemoveFile,
    nextStep,
    prevStep,
  };
};
