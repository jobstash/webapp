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

export const PROFILE_TIERS = [
  {
    name: 'Lurker',
    color: 'text-neutral-500',
    bgColor: 'bg-neutral-500',
    message: 'Complete your profile to get started',
    minItems: 0,
  },
  {
    name: 'Starter',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500',
    message: "You're on the map",
    minItems: 1,
  },
  {
    name: 'Active',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    message: 'Getting noticed by recruiters',
    minItems: 2,
  },
  {
    name: 'Strong',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500',
    message: 'Standing out from the crowd',
    minItems: 3,
  },
  {
    name: 'All-Star',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    message: "Maximum visibility — you're all set",
    minItems: 4,
  },
] as const;

export type ProfileTier = (typeof PROFILE_TIERS)[number];

export const COMPLETENESS_ITEMS = [
  {
    key: 'skills',
    label: 'Add your skills',
    action: 'Add Skills',
    unlocks: 'Unlock personalized job matches',
    href: '/profile',
  },
  {
    key: 'resume',
    label: 'Upload your resume',
    action: 'Add Resume',
    unlocks: 'Stand out to recruiters',
    href: '/profile',
  },
  {
    key: 'social',
    label: 'Connect your socials',
    action: 'Add Socials',
    unlocks: 'Show your professional presence',
    href: '/profile',
  },
  {
    key: 'email',
    label: 'Add your email',
    action: 'Add Email',
    unlocks: 'Let recruiters reach you directly',
    href: '/profile',
  },
] as const;
