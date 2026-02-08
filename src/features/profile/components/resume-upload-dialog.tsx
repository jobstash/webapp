'use client';

import {
  FileTextIcon,
  LoaderIcon,
  ScanSearchIcon,
  UploadIcon,
  XIcon,
} from 'lucide-react';

import { MAX_MATCH_SKILLS } from '@/lib/constants';
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TAG_COLORS } from '@/features/onboarding/constants';
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
                      skillCount > MAX_MATCH_SKILLS
                        ? 'text-destructive'
                        : 'text-muted-foreground',
                    )}
                  >
                    {skillCount}/{MAX_MATCH_SKILLS}
                  </p>
                </div>

                {skillCount > MAX_MATCH_SKILLS && (
                  <p className='text-sm text-destructive'>
                    Remove {skillCount - MAX_MATCH_SKILLS} skill
                    {skillCount - MAX_MATCH_SKILLS !== 1 && 's'} to continue
                    (max {MAX_MATCH_SKILLS})
                  </p>
                )}

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
              newSkillCount > 0 && (
                <div className='flex items-center justify-between rounded-lg border border-border px-4 py-3'>
                  <Label
                    htmlFor='include-skills'
                    className='flex cursor-pointer items-center gap-2 text-sm'
                  >
                    <ScanSearchIcon className='size-4 shrink-0 text-muted-foreground' />
                    {newSkillCount} new skill{newSkillCount !== 1 && 's'} found
                  </Label>
                  <Switch
                    id='include-skills'
                    checked={includeSkills}
                    onCheckedChange={setIncludeSkills}
                  />
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
