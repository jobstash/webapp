import type { ComponentType } from 'react';

import {
  BriefcaseBusinessIcon,
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';

import { FarcasterIcon } from '@/components/svg/farcaster-icon';
import { GoogleIcon } from '@/components/svg/google-icon';
import { TelegramIcon } from '@/components/svg/telegram-icon';
import { TwitterIcon } from '@/components/svg/twitter-icon';

export const PROFILE_NAV_ITEMS = [
  { label: 'Overview', href: '/profile', icon: UserIcon },
  { label: 'Jobs For You', href: '/profile/jobs', icon: BriefcaseBusinessIcon },
  { label: 'Settings', href: '/profile/settings', icon: SettingsIcon },
] as const;

export const SHOWCASE_ICON_MAP: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  Github: GithubIcon,
  Google: GoogleIcon,
  Linkedin: LinkedinIcon,
  X: TwitterIcon,
  Telegram: TelegramIcon,
  Discord: MessageCircleIcon,
  Farcaster: FarcasterIcon,
  Lens: GlobeIcon,
  Website: GlobeIcon,
  Email: MailIcon,
  Phone: PhoneIcon,
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
    color:
      'bg-linear-to-r from-[#f5a00d] to-[#8743FF] bg-clip-text text-transparent',
    bgColor: 'bg-linear-to-r from-[#D68800] to-[#8743FF]',
    message: 'Fully optimized — recruiters see you first',
    minItems: 4,
  },
] as const;

export type ProfileTier = (typeof PROFILE_TIERS)[number];

const SOCIAL_LABEL_OVERRIDES: Record<string, string> = { twitter: 'X' };

export const getSocialLabel = (kind: string): string =>
  SOCIAL_LABEL_OVERRIDES[kind] ?? kind.charAt(0).toUpperCase() + kind.slice(1);

const withPrefix = (prefix: string) => (h: string) =>
  h.startsWith('http') ? h : `${prefix}${h}`;

export const SOCIAL_URL_TEMPLATES: Record<string, (handle: string) => string> =
  {
    website: withPrefix('https://'),
    lens: withPrefix('https://hey.xyz/profile/'),
    linkedin: withPrefix('https://linkedin.com/in/'),
    twitter: withPrefix('https://x.com/'),
    telegram: withPrefix('https://t.me/'),
    discord: (h) => h,
    github: withPrefix('https://github.com/'),
    farcaster: withPrefix('https://warpcast.com/'),
    phone: (h) => h,
  };

const HANDLE_EXTRACTION_PATTERNS: Record<string, RegExp> = {
  lens: /hey\.xyz\/profile\/([^/?#]+)/,
  linkedin: /linkedin\.com\/in\/([^/?#]+)/,
  twitter: /(?:twitter|x)\.com\/([^/?#]+)/,
  telegram: /t\.me\/([^/?#]+)/,
  github: /github\.com\/([^/?#]+)/,
  farcaster: /warpcast\.com\/([^/?#]+)/,
};

export const extractHandleFromUrl = (
  kind: string,
  url: string,
): string | null => {
  const pattern = HANDLE_EXTRACTION_PATTERNS[kind];
  if (!pattern) return url; // website, discord, phone — handle IS the url

  const match = url.match(pattern);
  return match?.[1] ?? null;
};

const SHOWCASE_LABEL_TO_KIND: Record<string, string> = {
  Github: 'github',
  Farcaster: 'farcaster',
  Linkedin: 'linkedin',
  X: 'twitter',
  Telegram: 'telegram',
  Website: 'website',
  Lens: 'lens',
  Discord: 'discord',
  Phone: 'phone',
};

export const getDisplayHandle = (label: string, url: string): string | null => {
  const kind = SHOWCASE_LABEL_TO_KIND[label];
  if (!kind) return null;
  return extractHandleFromUrl(kind, url);
};

export type CtaType =
  | 'skills-editor'
  | 'resume-upload'
  | 'manual-links-editor'
  | 'linked-accounts';

export const COMPLETENESS_ITEMS: readonly {
  key: string;
  label: string;
  action: string;
  unlocks: string;
  ctaType: CtaType;
}[] = [
  {
    key: 'resume',
    label: 'Upload your resume',
    action: 'Add Resume',
    unlocks: 'Auto-detect skills and stand out to recruiters',
    ctaType: 'resume-upload',
  },
  {
    key: 'skills',
    label: 'Add your skills',
    action: 'Add Skills',
    unlocks: 'Unlock personalized job matches',
    ctaType: 'skills-editor',
  },
  {
    key: 'linked-accounts',
    label: 'Link an account',
    action: 'Link Account',
    unlocks: 'Verify your identity and boost visibility',
    ctaType: 'linked-accounts',
  },
  {
    key: 'manual-links',
    label: 'Add your contacts',
    action: 'Add Contacts',
    unlocks: 'Help recruiters find your work',
    ctaType: 'manual-links-editor',
  },
];

export const TAG_COLORS: Record<number, string> = {
  0: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20',
  1: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-orange-500/20',
  2: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
  3: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ring-yellow-500/20',
  4: 'bg-lime-500/10 text-lime-600 dark:text-lime-400 ring-lime-500/20',
  5: 'bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20',
  6: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
  7: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-teal-500/20',
  8: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 ring-cyan-500/20',
  9: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20',
  10: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20',
  11: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/20',
};
