import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { clientEnv } from '@/lib/env/client';
import { resumeParseResponseSchema } from '@/features/onboarding/schemas';
import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';

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

  const [isParsing, setIsParsing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File): Promise<void> => {
    setError(null);
    setIsSuccess(false);

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

      const cvEntry = {
        label: 'CV',
        url: `${clientEnv.FRONTEND_URL}/api/resume/${parsed.resumeId}`,
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
      setIsSuccess(true);
    } catch {
      setError(
        'Something went wrong while processing your resume. Please try again.',
      );
      setFileName(null);
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

  const reset = () => {
    setError(null);
    setIsSuccess(false);
    setFileName(null);
    setIsParsing(false);
    setIsDragActive(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  return {
    isParsing,
    isDragActive,
    error,
    isSuccess,
    fileName,
    acceptedFileTypes: ACCEPTED_FILE_TYPES,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleOpenFilePicker,
    handleOpenChange,
  };
};
