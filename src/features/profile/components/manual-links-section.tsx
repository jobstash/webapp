'use client';

import {
  ContactIcon,
  GlobeIcon,
  PencilIcon,
  PlusIcon,
  SquarePenIcon,
} from 'lucide-react';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSession } from '@/features/auth/hooks/use-session';
import {
  getDisplayHandle,
  SHOWCASE_ICON_MAP,
} from '@/features/profile/constants';
import { useLinkedAccounts } from '@/features/profile/hooks/use-linked-accounts';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import type { ShowcaseItem } from '@/features/profile/schemas';

import { useProfileEditor } from './profile-editor-provider';

const EXCLUDED_LABELS = new Set(['CV']);
const EDITABLE_LABELS = new Set(['Website', 'Lens']);
const PLAIN_TEXT_LABELS = new Set(['Email', 'Phone', 'Google']);

const PILL_BASE = cn(
  'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
  'bg-accent/60 text-sm font-medium',
  'ring-1 ring-neutral-700/50',
);

const PILL_LINK_CLASS = cn(
  PILL_BASE,
  'transition-colors hover:bg-accent hover:ring-neutral-600/50',
);

const ensureProtocol = (url: string): string =>
  url.startsWith('http') ? url : `https://${url}`;

type ContactMapping = {
  label: string;
  urlPrefix: string;
  field: 'username' | 'email';
};

const PRIVY_CONTACT_MAP: Record<string, ContactMapping> = {
  github_oauth: {
    label: 'Github',
    urlPrefix: 'https://github.com/',
    field: 'username',
  },
  google_oauth: { label: 'Google', urlPrefix: '', field: 'email' },
  email: { label: 'Email', urlPrefix: '', field: 'email' },
  // TODO: Farcaster temporarily hidden
  // farcaster: { label: 'Farcaster', urlPrefix: 'https://warpcast.com/', field: 'username' },
};

const SectionHeader = () => (
  <div>
    <h3 className='text-base font-semibold'>Contacts</h3>
    <p className='text-xs text-muted-foreground'>How recruiters can find you</p>
  </div>
);

export const ManualLinksSection = () => {
  const { isSessionReady } = useSession();
  const { data: showcase, isPending } = useProfileShowcase(isSessionReady);
  const { data: linkedAccounts } = useLinkedAccounts();
  const { openManualLinksEditor } = useProfileEditor();

  if (isPending) {
    return (
      <div className='flex flex-col gap-3'>
        <SectionHeader />
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-24 rounded-full' />
          ))}
        </div>
      </div>
    );
  }

  const contacts: ShowcaseItem[] = (showcase ?? []).filter(
    (item) => !EXCLUDED_LABELS.has(item.label),
  );

  const existingLabels = new Set(contacts.map((c) => c.label));

  for (const account of linkedAccounts ?? []) {
    const mapping = PRIVY_CONTACT_MAP[account.type];
    if (!mapping) continue;
    const value = mapping.field === 'email' ? account.email : account.username;
    if (!value || existingLabels.has(mapping.label)) continue;
    contacts.push({
      label: mapping.label,
      url: `${mapping.urlPrefix}${value}`,
    });
    existingLabels.add(mapping.label);
  }

  const editableCount = contacts.filter((item) =>
    EDITABLE_LABELS.has(item.label),
  ).length;

  if (contacts.length === 0) {
    return (
      <div className='flex flex-col gap-3'>
        <SectionHeader />
        <div className='flex flex-col items-center gap-3 py-4'>
          <ContactIcon className='size-8 text-muted-foreground/50' />
          <p className='text-sm text-muted-foreground'>
            Add your website or social profiles
          </p>
          <Button variant='ghost' size='sm' onClick={openManualLinksEditor}>
            <PencilIcon className='size-3.5' />
            Add Contacts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-start justify-between'>
        <SectionHeader />
        <button
          type='button'
          className='mt-0.5 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground/60 transition-colors hover:bg-accent/50 hover:text-muted-foreground'
          onClick={openManualLinksEditor}
        >
          <SquarePenIcon className='size-3.5' />
          <span className='hidden sm:inline'>Edit</span>
        </button>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        {contacts.map((item) => {
          const Icon = SHOWCASE_ICON_MAP[item.label] ?? GlobeIcon;
          const handle = getDisplayHandle(item.label, item.url);
          const isPlainText = PLAIN_TEXT_LABELS.has(item.label);

          if (isPlainText) {
            return (
              <Tooltip key={`${item.label}-${item.url}`}>
                <TooltipTrigger asChild>
                  <span className={PILL_BASE}>
                    <Icon className='size-3.5 text-muted-foreground' />
                    {item.url}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              key={`${item.label}-${item.url}`}
              href={ensureProtocol(item.url)}
              target='_blank'
              rel='noopener noreferrer'
              className={PILL_LINK_CLASS}
            >
              <Icon className='size-3.5 text-muted-foreground' />
              {handle ?? item.url.replace(/^https?:\/\//, '')}
            </Link>
          );
        })}
        {editableCount < EDITABLE_LABELS.size && (
          <button
            type='button'
            className='inline-flex items-center gap-1 rounded-full text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground'
            onClick={openManualLinksEditor}
          >
            <PlusIcon className='size-3' />
            Add contact
          </button>
        )}
      </div>
    </div>
  );
};
