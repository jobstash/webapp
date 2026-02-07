'use client';

import {
  GithubIcon,
  Link2Icon,
  LinkedinIcon,
  PencilIcon,
  SquarePenIcon,
} from 'lucide-react';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TwitterIcon } from '@/components/svg/twitter-icon';
import { useSession } from '@/features/auth/hooks/use-session';
import { SHOWCASE_ICON_MAP } from '@/features/profile/constants';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import type { ShowcaseItem } from '@/features/profile/schemas';

import { useProfileEditor } from './profile-editor-provider';

const EXCLUDED_LABELS = new Set(['Email', 'CV', 'Website']);

const ensureProtocol = (url: string): string =>
  url.startsWith('http') ? url : `https://${url}`;

const getIcon = (label: string): React.ComponentType<{ className?: string }> =>
  SHOWCASE_ICON_MAP[label] ?? Link2Icon;

const getDisplayLabel = (item: ShowcaseItem): string => {
  if (item.label === 'Github') {
    const match = item.url.match(/github\.com\/([^/?#]+)/);
    if (match) return match[1];
  }
  return item.label;
};

const PILL_CLASS = cn(
  'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
  'bg-accent/60 text-sm font-medium',
  'ring-1 ring-neutral-700/50',
  'transition-colors hover:bg-accent hover:ring-neutral-600/50',
);

const SectionHeader = ({ onEdit }: { onEdit?: () => void }) => (
  <div className='flex items-start justify-between'>
    <div>
      <h3 className='text-base font-semibold'>Socials</h3>
      <p className='text-xs text-muted-foreground'>
        Show your professional presence to hiring teams
      </p>
    </div>
    {onEdit && (
      <button
        type='button'
        className='mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground'
        onClick={onEdit}
      >
        <SquarePenIcon className='size-3.5' />
        <span className='hidden sm:inline'>Edit</span>
      </button>
    )}
  </div>
);

export const SocialsSection = () => {
  const { isSessionReady } = useSession();
  const { data: showcase, isPending } = useProfileShowcase(isSessionReady);
  const { openSocialsEditor } = useProfileEditor();

  if (isPending) {
    return (
      <div className='flex flex-col gap-3'>
        <SectionHeader />
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-24 rounded-full' />
          ))}
        </div>
      </div>
    );
  }

  const socials = (showcase ?? []).filter(
    (item) => !EXCLUDED_LABELS.has(item.label),
  );

  if (socials.length === 0) {
    return (
      <div className='flex flex-col gap-3'>
        <SectionHeader />
        <div className='flex flex-col items-center gap-3 py-4'>
          <div className='flex items-center gap-3'>
            {[GithubIcon, LinkedinIcon, TwitterIcon].map((Icon, i) => (
              <div
                key={i}
                className='flex size-8 items-center justify-center rounded-lg bg-accent/50'
              >
                <Icon className='size-4 text-muted-foreground/30' />
              </div>
            ))}
          </div>
          <p className='text-sm text-muted-foreground'>
            Connect your socials to show your professional presence
          </p>
          <Button variant='ghost' size='sm' onClick={openSocialsEditor}>
            <PencilIcon className='size-3.5' />
            Add Socials
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <SectionHeader onEdit={openSocialsEditor} />
      <div className='flex flex-wrap gap-2'>
        {socials.map((item) => {
          const Icon = getIcon(item.label);
          return (
            <Link
              key={`${item.label}-${item.url}`}
              href={ensureProtocol(item.url)}
              target='_blank'
              rel='noopener noreferrer'
              className={PILL_CLASS}
            >
              <Icon className='size-3.5 text-muted-foreground' />
              {getDisplayLabel(item)}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
