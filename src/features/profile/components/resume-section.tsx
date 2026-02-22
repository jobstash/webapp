'use client';

import { ExternalLinkIcon, FileUpIcon, UploadIcon } from 'lucide-react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';

import { useProfileEditor } from './profile-editor-provider';

const CARD_CLASS = 'rounded-2xl border border-neutral-800/50 bg-sidebar p-4';

const SectionHeader = () => (
  <div className='mb-3'>
    <h3 className='text-base font-semibold'>Resume</h3>
    <p className='text-xs text-muted-foreground'>
      Let your experience speak for itself
    </p>
  </div>
);

export const ResumeSection = () => {
  const { isSessionReady } = useSession();
  const { data: showcase, isPending } = useProfileShowcase(isSessionReady);
  const { openResumeUpload } = useProfileEditor();

  if (isPending) {
    return (
      <div className={CARD_CLASS}>
        <SectionHeader />
        <Skeleton className='h-8 w-32 rounded-full' />
      </div>
    );
  }

  const resume = (showcase ?? []).find((i) => i.label === 'CV');

  if (!resume) {
    return (
      <div className={CARD_CLASS}>
        <SectionHeader />
        <div className='flex flex-col items-center gap-3 py-4'>
          <div className='flex size-8 items-center justify-center rounded-lg bg-accent/50'>
            <UploadIcon className='size-4 text-muted-foreground/30' />
          </div>
          <p className='text-sm text-muted-foreground'>
            Upload your resume to stand out
          </p>
          <Button variant='ghost' size='sm' onClick={openResumeUpload}>
            <UploadIcon className='size-3.5' />
            Upload Resume
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={CARD_CLASS}>
      <SectionHeader />
      <div className='flex gap-2'>
        <Button variant='secondary' size='sm' className='flex-1' asChild>
          <Link href={resume.url} target='_blank' rel='noopener noreferrer'>
            <ExternalLinkIcon className='size-3.5' />
            View File
          </Link>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='flex-1'
          onClick={openResumeUpload}
        >
          <FileUpIcon className='size-3.5' />
          Upload New
        </Button>
      </div>
    </div>
  );
};
