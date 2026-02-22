import { type ComponentType, useEffect, useState } from 'react';

import { GlobeIcon, LinkedinIcon, MessageCircleIcon } from 'lucide-react';

import { useQueryClient } from '@tanstack/react-query';

import { TelegramIcon } from '@/components/svg/telegram-icon';
import { TwitterIcon } from '@/components/svg/twitter-icon';
import { useSession } from '@/features/auth/hooks/use-session';
import {
  extractHandleFromUrl,
  SOCIAL_URL_TEMPLATES,
} from '@/features/profile/constants';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import type { ShowcaseItem } from '@/features/profile/schemas';

const CONTACT_KINDS = [
  'website',
  'lens',
  'linkedin',
  'twitter',
  'telegram',
  'discord',
] as const;

type ContactKind = (typeof CONTACT_KINDS)[number];

const CONTACT_LABELS: Record<ContactKind, string> = {
  website: 'Website',
  lens: 'Lens',
  linkedin: 'LinkedIn',
  twitter: 'Twitter / X',
  telegram: 'Telegram',
  discord: 'Discord',
};

const CONTACT_ICONS: Record<
  ContactKind,
  ComponentType<{ className?: string }>
> = {
  website: GlobeIcon,
  lens: GlobeIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
  discord: MessageCircleIcon,
};

const CONTACT_PLACEHOLDERS: Record<ContactKind, string> = {
  website: 'https://yoursite.com',
  lens: 'yourname.lens',
  linkedin: 'username or profile URL',
  twitter: 'username',
  telegram: 'username',
  discord: 'username#1234',
};

const labelToKind = (label: string): ContactKind | null => {
  const lower = label.toLowerCase() as ContactKind;
  return CONTACT_KINDS.includes(lower) ? lower : null;
};

/** Labels that are preserved (not editable here) when saving */
const PRESERVED_LABELS = new Set(['CV', 'Email', 'Github', 'Farcaster']);

interface UseManualLinksEditorParams {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ContactPillItem {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export const useManualLinksEditor = ({
  isOpen,
  onOpenChange,
}: UseManualLinksEditorParams) => {
  const queryClient = useQueryClient();
  const { isSessionReady } = useSession();
  const { data: showcase } = useProfileShowcase(isSessionReady);

  const [selectedKinds, setSelectedKinds] = useState<Set<string>>(new Set());
  const [handles, setHandles] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const items = showcase ?? [];
    const selected = new Set<string>();
    const newHandles: Record<string, string> = {};

    for (const kind of CONTACT_KINDS) {
      newHandles[kind] = '';
    }

    for (const item of items) {
      if (PRESERVED_LABELS.has(item.label)) continue;
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

      const preserved: ShowcaseItem[] = items.filter((item) =>
        PRESERVED_LABELS.has(item.label),
      );

      const entries: { label: string; url: string }[] = [...preserved];

      for (const kind of CONTACT_KINDS) {
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
      setError('Failed to save contacts. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const pillItems: ContactPillItem[] = CONTACT_KINDS.map((kind) => ({
    key: kind,
    label: CONTACT_LABELS[kind],
    icon: CONTACT_ICONS[kind],
  }));

  const selectedList = CONTACT_KINDS.filter((kind) => selectedKinds.has(kind));

  return {
    pillItems,
    selectedKinds,
    toggleKind,
    handles,
    setHandle,
    isSaving,
    error,
    handleSave,
    contactIcons: CONTACT_ICONS,
    contactLabels: CONTACT_LABELS,
    contactPlaceholders: CONTACT_PLACEHOLDERS,
    selectedList,
  };
};
