'use client';

import {
  DownloadIcon,
  ExternalLinkIcon,
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  Link2Icon,
  MailIcon,
  MessageCircleIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { FarcasterIcon } from '@/components/svg/farcaster-icon';
import { TelegramIcon } from '@/components/svg/telegram-icon';
import { TwitterIcon } from '@/components/svg/twitter-icon';
import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import type { ShowcaseItem } from '@/features/profile/schemas';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Github: GithubIcon,
  Linkedin: LinkedinIcon,
  Twitter: TwitterIcon,
  Telegram: TelegramIcon,
  Discord: MessageCircleIcon,
  Farcaster: FarcasterIcon,
  Lens: GlobeIcon,
  Website: GlobeIcon,
  Email: MailIcon,
};

const getIcon = (label: string): React.ComponentType<{ className?: string }> =>
  ICON_MAP[label] ?? Link2Icon;

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

export const ProfileSocials = () => {
  const { isSessionReady } = useSession();
  const { data: showcase, isPending } = useProfileShowcase(isSessionReady);

  if (isPending) {
    return (
      <div className='flex flex-col gap-4'>
        <h2 className='text-lg font-semibold'>Socials</h2>
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-12 w-full rounded-lg' />
          ))}
        </div>
      </div>
    );
  }

  const items = showcase ?? [];
  const { socials, email, resume } = groupShowcase(items);
  const isEmpty = socials.length === 0 && !email && !resume;

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-lg font-semibold'>Socials</h2>

      {isEmpty ? (
        <div className='flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8'>
          <Link2Icon className='size-8 text-muted-foreground/50' />
          <p className='text-sm text-muted-foreground'>
            No socials yet — complete onboarding to add your socials
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
          {socials.map((item) => {
            const Icon = getIcon(item.label);
            return (
              <a
                key={`${item.label}-${item.url}`}
                href={item.url}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(
                  'flex items-center gap-3 rounded-lg border border-border p-3',
                  'transition-colors hover:bg-accent/50',
                )}
              >
                <Icon className='size-4 shrink-0 text-muted-foreground' />
                <div className='flex min-w-0 grow flex-col'>
                  <span className='text-sm font-medium'>{item.label}</span>
                  <span className='truncate text-xs text-muted-foreground'>
                    {item.url}
                  </span>
                </div>
                <ExternalLinkIcon className='size-3.5 shrink-0 text-muted-foreground' />
              </a>
            );
          })}

          {email && (
            <a
              href={`mailto:${email.url}`}
              className={cn(
                'flex items-center gap-3 rounded-lg border border-border p-3',
                'transition-colors hover:bg-accent/50',
              )}
            >
              <MailIcon className='size-4 shrink-0 text-muted-foreground' />
              <div className='flex min-w-0 grow flex-col'>
                <span className='text-sm font-medium'>Email</span>
                <span className='truncate text-xs text-muted-foreground'>
                  {email.url}
                </span>
              </div>
              <ExternalLinkIcon className='size-3.5 shrink-0 text-muted-foreground' />
            </a>
          )}

          {resume && (
            <a
              href={resume.url}
              target='_blank'
              rel='noopener noreferrer'
              className={cn(
                'flex items-center gap-3 rounded-lg border border-border p-3',
                'transition-colors hover:bg-accent/50',
              )}
            >
              <DownloadIcon className='size-4 shrink-0 text-muted-foreground' />
              <div className='flex min-w-0 grow flex-col'>
                <span className='text-sm font-medium'>Resume / CV</span>
                <span className='truncate text-xs text-muted-foreground'>
                  Download
                </span>
              </div>
              <ExternalLinkIcon className='size-3.5 shrink-0 text-muted-foreground' />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
