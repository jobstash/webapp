import type { ComponentType } from 'react';

import {
  BriefcaseBusinessIcon,
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
  { label: 'Jobs For You', href: '/profile/jobs', icon: BriefcaseBusinessIcon },
  { label: 'Settings', href: '/profile/settings', icon: SettingsIcon },
] as const;

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

const CONTACT_LABELS = new Set(['Email', 'CV', 'Website']);

export const SOCIAL_LABELS = Object.keys(SHOWCASE_ICON_MAP).filter(
  (label) => !CONTACT_LABELS.has(label),
);

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
    message: 'Maximum visibility across all recruiters',
    minItems: 4,
  },
] as const;

export type ProfileTier = (typeof PROFILE_TIERS)[number];

export const SOCIAL_URL_TEMPLATES: Record<string, (handle: string) => string> =
  {
    github: (h) => (h.startsWith('http') ? h : `https://github.com/${h}`),
    linkedin: (h) =>
      h.startsWith('http') ? h : `https://linkedin.com/in/${h}`,
    twitter: (h) => (h.startsWith('http') ? h : `https://x.com/${h}`),
    telegram: (h) => (h.startsWith('http') ? h : `https://t.me/${h}`),
    discord: (h) => h,
    website: (h) => (h.startsWith('http') ? h : `https://${h}`),
    farcaster: (h) => (h.startsWith('http') ? h : `https://warpcast.com/${h}`),
    lens: (h) => (h.startsWith('http') ? h : `https://hey.xyz/profile/${h}`),
  };

export const extractHandleFromUrl = (
  kind: string,
  url: string,
): string | null => {
  const patterns: Record<string, RegExp> = {
    github: /github\.com\/([^/?#]+)/,
    linkedin: /linkedin\.com\/in\/([^/?#]+)/,
    twitter: /x\.com\/([^/?#]+)/,
    telegram: /t\.me\/([^/?#]+)/,
    farcaster: /warpcast\.com\/([^/?#]+)/,
    lens: /hey\.xyz\/profile\/([^/?#]+)/,
  };

  const pattern = patterns[kind];
  if (!pattern) return url; // discord, website — handle IS the url

  const match = url.match(pattern);
  return match?.[1] ?? null;
};

export type CtaType =
  | 'skills-editor'
  | 'resume-upload'
  | 'contact-info-editor'
  | 'socials-editor';

export const COMPLETENESS_ITEMS: readonly {
  key: string;
  label: string;
  action: string;
  unlocks: string;
  ctaType: CtaType;
}[] = [
  {
    key: 'skills',
    label: 'Add your skills',
    action: 'Add Skills',
    unlocks: 'Unlock personalized job matches',
    ctaType: 'skills-editor',
  },
  {
    key: 'resume',
    label: 'Upload your resume',
    action: 'Add Resume',
    unlocks: 'Stand out to recruiters',
    ctaType: 'resume-upload',
  },
  {
    key: 'social',
    label: 'Connect your socials',
    action: 'Add Socials',
    unlocks: 'Show your professional presence',
    ctaType: 'socials-editor',
  },
  {
    key: 'email',
    label: 'Add your email',
    action: 'Add Email',
    unlocks: 'Let recruiters reach you directly',
    ctaType: 'contact-info-editor',
  },
];
