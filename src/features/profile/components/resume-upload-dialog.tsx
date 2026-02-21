'use client';

import {
  FileTextIcon,
  LoaderIcon,
  PlusIcon,
  UploadIcon,
  XIcon,
} from 'lucide-react';

import { SKILL_STATUS_MESSAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field';
import { TAG_COLORS } from '@/features/profile/constants';
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
    isAnalyzed,
    fileName,
    acceptedFileTypes,
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
  } = useResumeUpload({ onOpenChange });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>
            Upload your resume to stand out to recruiters
          </DialogDescription>
        </DialogHeader>

        {isAnalyzed ? (
          <>
            <div className='flex flex-col items-center gap-1 py-6'>
              <FileTextIcon className='size-10 text-muted-foreground' />
              {fileName && (
                <p className='text-sm text-muted-foreground'>{fileName}</p>
              )}
            </div>

            {isOverCap ? (
              <div className='flex flex-col gap-3'>
                <div className='flex items-baseline justify-between'>
                  <p className='text-sm font-medium'>Skills</p>
                  <p
                    className={cn(
                      'text-sm font-medium',
                      skillStatus === 'warning' &&
                        'text-amber-600 dark:text-amber-400',
                      skillStatus === 'error' && 'text-destructive',
                      skillStatus === 'ok' && 'text-muted-foreground',
                    )}
                  >
                    {SKILL_STATUS_MESSAGE[skillStatus]}
                  </p>
                </div>

                <div className='flex max-h-48 flex-wrap content-start gap-2 overflow-y-auto'>
                  {editedSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium ring-1',
                        TAG_COLORS[skill.colorIndex] ?? TAG_COLORS[0],
                      )}
                    >
                      {skill.name}
                      <button
                        type='button'
                        onClick={() => removeSkill(skill.id)}
                        className='rounded-full opacity-60 transition-opacity hover:opacity-100'
                        aria-label='Remove skill'
                      >
                        <XIcon className='size-3' />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              detectedSkillChips.length > 0 && (
                <div className='flex flex-col gap-3'>
                  <div>
                    <p className='text-sm font-medium'>
                      {newSkillCount} new skill{newSkillCount !== 1 && 's'}{' '}
                      found
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Tap to exclude unwanted skills
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {detectedSkillChips.map((skill) => (
                      <button
                        key={skill.id}
                        type='button'
                        onClick={() => toggleSkill(skill.id)}
                        className={cn(
                          'group inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium transition-all',
                          skill.isExcluded
                            ? 'border border-dashed border-current bg-transparent opacity-50 ring-0 hover:opacity-70'
                            : 'border border-transparent ring-1 hover:opacity-80',
                          TAG_COLORS[skill.colorIndex] ?? TAG_COLORS[0],
                        )}
                      >
                        {skill.name}
                        {skill.isExcluded ? (
                          <PlusIcon className='size-3 opacity-60' />
                        ) : (
                          <XIcon className='size-3 opacity-40 transition-opacity sm:opacity-0 sm:group-hover:opacity-60' />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}

            <DialogFooter>
              <Button
                variant='ghost'
                onClick={() => handleOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={save} disabled={isSaving || !canSave}>
                {isSaving ? (
                  <>
                    <LoaderIcon className='size-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </>
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
