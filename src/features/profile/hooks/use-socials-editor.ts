import { type ComponentType, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MessageCircleIcon,
} from 'lucide-react';

import { FarcasterIcon } from '@/components/svg/farcaster-icon';
import { TelegramIcon } from '@/components/svg/telegram-icon';
import { TwitterIcon } from '@/components/svg/twitter-icon';
import type { SocialKind } from '@/features/onboarding/schemas';
import { useSession } from '@/features/auth/hooks/use-session';
import {
  extractHandleFromUrl,
  SOCIAL_URL_TEMPLATES,
} from '@/features/profile/constants';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import type { ShowcaseItem } from '@/features/profile/schemas';

const SOCIAL_KINDS: SocialKind[] = [
  'github',
  'linkedin',
  'twitter',
  'telegram',
  'discord',
  'farcaster',
  'lens',
];

const SOCIAL_PLACEHOLDERS: Record<string, string> = {
  github: 'username',
  linkedin: 'username or profile URL',
  twitter: 'username',
  telegram: 'username',
  discord: 'username#1234',
  farcaster: 'username',
  lens: 'handle',
};

const SOCIAL_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
  discord: MessageCircleIcon,
  farcaster: FarcasterIcon,
  lens: GlobeIcon,
};

const SOCIAL_LABELS: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'Twitter / X',
  telegram: 'Telegram',
  discord: 'Discord',
  farcaster: 'Farcaster',
  lens: 'Lens',
};

export interface SocialPillItem {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const labelToKind = (label: string): SocialKind | null => {
  const lower = label.toLowerCase() as SocialKind;
  if (SOCIAL_KINDS.includes(lower)) return lower;
  return null;
};

const createEmptyHandles = (): Record<string, string> => {
  const handles: Record<string, string> = {};
  for (const kind of SOCIAL_KINDS) {
    handles[kind] = '';
  }
  return handles;
};

interface UseSocialsEditorParams {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const useSocialsEditor = ({
  isOpen,
  onOpenChange,
}: UseSocialsEditorParams) => {
  const queryClient = useQueryClient();
  const { isSessionReady } = useSession();
  const { data: showcase } = useProfileShowcase(isSessionReady);

  const [selectedKinds, setSelectedKinds] = useState<Set<string>>(new Set());
  const [handles, setHandles] =
    useState<Record<string, string>>(createEmptyHandles);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const items = showcase ?? [];
    const selected = new Set<string>();
    const newHandles = createEmptyHandles();

    for (const item of items) {
      if (
        item.label === 'CV' ||
        item.label === 'Email' ||
        item.label === 'Website'
      )
        continue;
      const kind = labelToKind(item.label);
      if (kind) {
        selected.add(kind);
        newHandles[kind] = extractHandleFromUrl(kind, item.url) ?? '';
      }
    }

    setSelectedKinds(selected);
    setHandles(newHandles);
    setError(null);
  }, [isOpen, showcase]);

  const toggleKind = (kind: string) => {
    setSelectedKinds((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) {
        next.delete(kind);
      } else {
        next.add(kind);
      }
      return next;
    });
  };

  const setHandle = (kind: string, value: string) => {
    setHandles((prev) => ({ ...prev, [kind]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const items = showcase ?? [];

      const preserved: ShowcaseItem[] = items.filter(
        (item) =>
          item.label === 'CV' ||
          item.label === 'Email' ||
          item.label === 'Website',
      );

      const entries: { label: string; url: string }[] = [...preserved];

      for (const kind of SOCIAL_KINDS) {
        if (!selectedKinds.has(kind)) continue;
        const handle = handles[kind]?.trim();
        if (!handle) continue;
        const template = SOCIAL_URL_TEMPLATES[kind];
        if (!template) continue;
        const label = kind.charAt(0).toUpperCase() + kind.slice(1);
        entries.push({ label, url: template(handle) });
      }

      const res = await fetch('/api/profile/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showcase: entries }),
      });

      if (!res.ok) throw new Error('Failed to save');

      await queryClient.invalidateQueries({ queryKey: ['profile-showcase'] });
      onOpenChange(false);
    } catch {
      setError('Failed to save socials. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const pillItems: SocialPillItem[] = SOCIAL_KINDS.map((kind) => ({
    key: kind,
    label: SOCIAL_LABELS[kind] ?? kind,
    icon: SOCIAL_ICONS[kind] ?? GlobeIcon,
  }));

  const selectedList = SOCIAL_KINDS.filter((kind) => selectedKinds.has(kind));

  return {
    pillItems,
    selectedKinds,
    toggleKind,
    handles,
    setHandle,
    isSaving,
    error,
    handleSave,
    socialIcons: SOCIAL_ICONS,
    socialLabels: SOCIAL_LABELS,
    socialPlaceholders: SOCIAL_PLACEHOLDERS,
    selectedList,
  };
};
