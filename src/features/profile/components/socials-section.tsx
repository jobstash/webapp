'use client';

import {
  DownloadIcon,
  ExternalLinkIcon,
  GithubIcon,
  Link2Icon,
  LinkedinIcon,
  MailIcon,
} from 'lucide-react';

import { TwitterIcon } from '@/components/svg/twitter-icon';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/features/auth/hooks/use-session';
import { SHOWCASE_ICON_MAP } from '@/features/profile/constants';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import type { ShowcaseItem } from '@/features/profile/schemas';

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

const groupShowcase = (items: ShowcaseItem[]) => {
  const socials: ShowcaseItem[] = [];
  let email: ShowcaseItem | null = null;
  let resume: ShowcaseItem | null = null;

  for (const item of items) {
    if (item.label === 'Email') {
      email = item;
    } else if (item.label === 'CV') {
      resume = item;
    } else {
      socials.push(item);
    }
  }

  return { socials, email, resume };
};

const PILL_CLASS = cn(
  'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
  'bg-accent/60 text-sm font-medium',
  'ring-1 ring-neutral-700/50',
  'transition-colors hover:bg-accent hover:ring-neutral-600/50',
);

export const SocialsSection = () => {
  const { isSessionReady } = useSession();
  const { data: showcase, isPending } = useProfileShowcase(isSessionReady);

  if (isPending) {
    return (
      <div className='flex flex-wrap gap-2'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-8 w-24 rounded-full' />
        ))}
      </div>
    );
  }

  const items = showcase ?? [];

  if (items.length === 0) {
    return (
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
      </div>
    );
  }

  const { socials, email, resume } = groupShowcase(items);

  return (
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

      {email && (
        <Link href={`mailto:${email.url}`} className={PILL_CLASS}>
          <MailIcon className='size-3.5 text-muted-foreground' />
          {email.url}
        </Link>
      )}

      {resume && (
        <Link
          href={resume.url}
          target='_blank'
          rel='noopener noreferrer'
          className={PILL_CLASS}
        >
          <DownloadIcon className='size-3.5 text-muted-foreground' />
          Resume
          <ExternalLinkIcon className='size-3 text-muted-foreground/50' />
        </Link>
      )}
    </div>
  );
};
