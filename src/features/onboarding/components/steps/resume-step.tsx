'use client';

import {
  CheckCircle2Icon,
  FileTextIcon,
  LoaderIcon,
  UploadIcon,
  XIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FieldDescription, FieldError } from '@/components/ui/field';
import { cn } from '@/lib/utils';

import { useResumeStep } from './use-resume-step';

const getDropZoneStyles = (hasFile: boolean, isDragActive: boolean) =>
  cn(
    'flex h-48 flex-col items-center justify-center gap-4 rounded-lg border-2 text-center transition-colors',
    hasFile && 'border-solid border-border',
    !hasFile && 'cursor-pointer border-dashed',
    !hasFile &&
      (isDragActive
        ? 'border-primary bg-primary/5'
        : 'border-muted-foreground/25 hover:border-muted-foreground/50'),
  );

const DescriptionContent = ({
  hasFile,
  isParsing,
  parsedResume,
}: {
  hasFile: boolean;
  isParsing: boolean;
  parsedResume: { skills: { id: string }[] } | null;
}) => {
  if (isParsing) return 'Reading your resume...';

  if (parsedResume) {
    return (
      <span className='inline-flex items-center gap-1.5'>
        <CheckCircle2Icon className='inline size-3.5 text-emerald-500' />
        Found {parsedResume.skills.length} skills, you can review them next.
      </span>
    );
  }

  if (!hasFile) {
    return "We'll extract details automatically, saving you time on the next steps.";
  }

  return '\u00A0';
};

export const ResumeStep = () => {
  const {
    resumeFile,
    parsedResume,
    isParsing,
    isDragActive,
    hasFile,
    error,
    acceptedFileTypes,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleOpenFilePicker,
    handleRemoveFile,
    nextStep,
    prevStep,
  } = useResumeStep();

  return (
    <div className='flex flex-col gap-6 sm:gap-8'>
      <section className='flex flex-col gap-3'>
        <h2 className='mb-4 text-xl font-semibold'>Upload Your Resume</h2>

        <div
          onDragOver={hasFile ? undefined : handleDragOver}
          onDragLeave={hasFile ? undefined : handleDragLeave}
          onDrop={hasFile ? undefined : handleDrop}
          onClick={hasFile ? undefined : handleOpenFilePicker}
          className={getDropZoneStyles(hasFile, isDragActive)}
        >
          {isParsing && (
            <LoaderIcon className='size-6 animate-spin text-muted-foreground' />
          )}

          {!isParsing && hasFile && (
            <>
              <FileTextIcon className='size-8 text-muted-foreground' />
              <div className='flex items-center gap-2 px-4'>
                <span className='max-w-60 truncate text-sm font-medium'>
                  {resumeFile?.name}
                </span>
                <button
                  type='button'
                  onClick={handleRemoveFile}
                  className='rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground'
                  aria-label='Remove file'
                >
                  <XIcon className='size-3.5' />
                </button>
              </div>
            </>
          )}

          {!hasFile && (
            <>
              <div
                className={cn(
                  'rounded-full p-3 transition-colors',
                  isDragActive
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <UploadIcon className='size-6' />
              </div>
              <div className='flex flex-col items-center gap-1'>
                <p className='font-medium'>Drag and drop your resume here</p>
                <p className='text-sm text-muted-foreground'>
                  or click to browse &middot; PDF, DOC, DOCX
                </p>
              </div>
            </>
          )}
        </div>

        {error && <FieldError>{error}</FieldError>}
        {!error && (
          <FieldDescription>
            <DescriptionContent
              hasFile={hasFile}
              isParsing={isParsing}
              parsedResume={parsedResume}
            />
          </FieldDescription>
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept={acceptedFileTypes}
          onChange={handleFileInputChange}
          className='hidden'
        />
      </section>

      <div className='flex flex-col gap-4'>
        <div className='h-px w-full bg-border' />
        <div className='flex items-center justify-between'>
          <Button variant='ghost' onClick={prevStep}>
            Back
          </Button>
          <Button
            variant={hasFile ? 'default' : 'ghost'}
            onClick={nextStep}
            disabled={hasFile && isParsing}
          >
            {hasFile ? 'Continue' : 'Skip'}
          </Button>
        </div>
      </div>
    </div>
  );
};
