import {
  BriefcaseIcon,
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MailIcon,
  MessageCircleIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react';

import { FarcasterIcon } from '@/components/svg/farcaster-icon';
import { TelegramIcon } from '@/components/svg/telegram-icon';
import { TwitterIcon } from '@/components/svg/twitter-icon';

export const PROFILE_NAV_ITEMS = [
  { label: 'Profile', href: '/profile', icon: UserIcon },
  { label: 'Jobs', href: '/profile/jobs', icon: BriefcaseIcon },
  { label: 'Accounts', href: '/profile/accounts', icon: UsersIcon },
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

export const COMPLETENESS_WEIGHTS = {
  hasSkills: 30,
  hasResume: 25,
  hasSocial: 20,
  hasEmail: 15,
  isExpert: 10,
} as const;
