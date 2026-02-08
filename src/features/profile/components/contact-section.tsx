'use client';

import {
  FileTextIcon,
  GlobeIcon,
  MailIcon,
  PencilIcon,
  PlusIcon,
  SquarePenIcon,
} from 'lucide-react';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';

import { useProfileEditor } from './profile-editor-provider';

const PILL_CLASS = cn(
  'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
  'bg-accent/60 text-sm font-medium',
  'ring-1 ring-neutral-700/50',
  'transition-colors hover:bg-accent hover:ring-neutral-600/50',
);

export const ContactSection = () => {
  const { isSessionReady } = useSession();
  const { data: showcase, isPending } = useProfileShowcase(isSessionReady);
  const { openContactInfoEditor } = useProfileEditor();

  if (isPending) {
    return (
      <div className='flex flex-col gap-3'>
        <div>
          <h3 className='text-base font-semibold'>Contact & Resume</h3>
          <p className='text-xs text-muted-foreground'>
            Your email, website, and resume for recruiters
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-24 rounded-full' />
          ))}
        </div>
      </div>
    );
  }

  const items = showcase ?? [];
  const email = items.find((i) => i.label === 'Email');
  const website = items.find((i) => i.label === 'Website');
  const resume = items.find((i) => i.label === 'CV');
  const hasContent = email || website || resume;

  if (!hasContent) {
    return (
      <div className='flex flex-col gap-3'>
        <div>
          <h3 className='text-base font-semibold'>Contact & Resume</h3>
          <p className='text-xs text-muted-foreground'>
            Your email, website, and resume for recruiters
          </p>
        </div>
        <div className='flex flex-col items-center gap-3 py-4'>
          <div className='flex items-center gap-3'>
            {[MailIcon, GlobeIcon].map((Icon, i) => (
              <div
                key={i}
                className='flex size-8 items-center justify-center rounded-lg bg-accent/50'
              >
                <Icon className='size-4 text-muted-foreground/30' />
              </div>
            ))}
          </div>
          <p className='text-sm text-muted-foreground'>
            Add your email and website so recruiters can reach you
          </p>
          <Button variant='ghost' size='sm' onClick={openContactInfoEditor}>
            <PencilIcon className='size-3.5' />
            Add Contact Info
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='text-base font-semibold'>Contact & Resume</h3>
          <p className='text-xs text-muted-foreground'>
            Your email, website, and resume for recruiters
          </p>
        </div>
        <button
          type='button'
          className='mt-0.5 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground/60 transition-colors hover:bg-accent/50 hover:text-muted-foreground'
          onClick={openContactInfoEditor}
        >
          <SquarePenIcon className='size-3.5' />
          <span className='hidden sm:inline'>Edit</span>
        </button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        {email && (
          <Link href={`mailto:${email.url}`} className={PILL_CLASS}>
            <MailIcon className='size-3.5 text-muted-foreground' />
            {email.url}
          </Link>
        )}

        {website && (
          <Link
            href={website.url}
            target='_blank'
            rel='noopener noreferrer'
            className={PILL_CLASS}
          >
            <GlobeIcon className='size-3.5 text-muted-foreground' />
            {website.url.replace(/^https?:\/\//, '')}
          </Link>
        )}

        {resume && (
          <Link
            href={resume.url}
            target='_blank'
            rel='noopener noreferrer'
            className={PILL_CLASS}
          >
            <FileTextIcon className='size-3.5 text-muted-foreground' />
            Resume
          </Link>
        )}

        <button
          type='button'
          className='inline-flex items-center gap-1 rounded-full text-xs text-muted-foreground/30 transition-colors hover:text-muted-foreground'
          onClick={openContactInfoEditor}
        >
          <PlusIcon className='size-3' />
          Add contact
        </button>
      </div>
    </div>
  );
};
