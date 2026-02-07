import type { ComponentType } from 'react';

import {
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MailIcon,
  MessageCircleIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';

import { FarcasterIcon } from '@/components/svg/farcaster-icon';
import { TelegramIcon } from '@/components/svg/telegram-icon';
import { TwitterIcon } from '@/components/svg/twitter-icon';

export const PROFILE_NAV_ITEMS = [
  { label: 'Overview', href: '/profile', icon: UserIcon },
  { label: 'Settings', href: '/profile/settings', icon: SettingsIcon },
] as const;

export const SOCIAL_PLATFORMS = {
  github: { label: 'GitHub', icon: GithubIcon },
  linkedin: { label: 'LinkedIn', icon: LinkedinIcon },
  twitter: { label: 'Twitter / X', icon: TwitterIcon },
  telegram: { label: 'Telegram', icon: TelegramIcon },
  discord: { label: 'Discord', icon: MessageCircleIcon },
  farcaster: { label: 'Farcaster', icon: FarcasterIcon },
  lens: { label: 'Lens', icon: GlobeIcon },
  website: { label: 'Website', icon: GlobeIcon },
  email: { label: 'Email', icon: MailIcon },
} as const;

/** Keyed by showcase item label from API (title-case, e.g. "Github") */
export const SHOWCASE_ICON_MAP: Record<
  string,
  ComponentType<{ className?: string }>
> = {
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

export const COMPLETENESS_WEIGHTS = {
  hasSkills: 35,
  hasResume: 25,
  hasSocial: 25,
  hasEmail: 15,
} as const;
