'use client';

import { CheckCircle2Icon, LoaderIcon, UploadIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field';
import { useResumeUpload } from '@/features/profile/hooks/use-resume-upload';

interface ResumeUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const getDropZoneStyles = (isDragActive: boolean) =>
  cn(
    'flex h-48 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed text-center transition-colors',
    isDragActive
      ? 'border-primary bg-primary/5'
      : 'border-muted-foreground/25 hover:border-muted-foreground/50',
  );

export const ResumeUploadDialog = ({
  isOpen,
  onOpenChange,
}: ResumeUploadDialogProps) => {
  const {
    isParsing,
    isDragActive,
    error,
    isSuccess,
    fileName,
    acceptedFileTypes,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleOpenFilePicker,
    handleOpenChange,
  } = useResumeUpload({ onOpenChange });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>
            Upload your resume to stand out to recruiters
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className='flex flex-col items-center gap-3 py-8'>
            <CheckCircle2Icon className='size-12 text-emerald-500' />
            <div className='text-center'>
              <p className='font-medium'>Resume uploaded</p>
              {fileName && (
                <p className='text-sm text-muted-foreground'>{fileName}</p>
              )}
            </div>
          </div>
        ) : isParsing ? (
          <div className='flex flex-col items-center gap-3 py-8'>
            <LoaderIcon className='size-8 animate-spin text-muted-foreground' />
            <div className='text-center'>
              <p className='font-medium'>Processing your resume...</p>
              {fileName && (
                <p className='text-sm text-muted-foreground'>{fileName}</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleOpenFilePicker}
              className={getDropZoneStyles(isDragActive)}
            >
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
            </div>

            {error && <FieldError>{error}</FieldError>}
          </>
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept={acceptedFileTypes}
          onChange={handleFileInputChange}
          className='hidden'
        />
      </DialogContent>
    </Dialog>
  );
};
