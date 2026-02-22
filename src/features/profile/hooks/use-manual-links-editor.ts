'use client';

import { type ComponentType, useEffect, useState } from 'react';

import {
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from 'lucide-react';

import { useQueryClient } from '@tanstack/react-query';

import { FarcasterIcon } from '@/components/svg/farcaster-icon';
import { GoogleIcon } from '@/components/svg/google-icon';
import { TelegramIcon } from '@/components/svg/telegram-icon';
import { TwitterIcon } from '@/components/svg/twitter-icon';
import { useSession } from '@/features/auth/hooks/use-session';
import {
  extractHandleFromUrl,
  getSocialLabel,
  SOCIAL_URL_TEMPLATES,
} from '@/features/profile/constants';
import { useLinkedAccounts } from '@/features/profile/hooks/use-linked-accounts';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import type { ShowcaseItem } from '@/features/profile/schemas';

const CONTACT_KINDS = [
  'website',
  'lens',
  'linkedin',
  'twitter',
  'telegram',
  'discord',
  'phone',
] as const;

type ContactKind = (typeof CONTACT_KINDS)[number];

const CONTACT_LABELS: Record<ContactKind, string> = {
  website: 'Website',
  lens: 'Lens',
  linkedin: 'LinkedIn',
  twitter: 'X',
  telegram: 'Telegram',
  discord: 'Discord',
  phone: 'Phone',
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
  phone: PhoneIcon,
};

const CONTACT_PLACEHOLDERS: Record<ContactKind, string> = {
  website: 'https://yoursite.com',
  lens: 'yourname.lens',
  linkedin: 'username or profile URL',
  twitter: 'username',
  telegram: 'username',
  discord: 'username#1234',
  phone: '+1 234 567 8900',
};

const LABEL_TO_KIND_OVERRIDES: Record<string, ContactKind> = { X: 'twitter' };

const labelToKind = (label: string): ContactKind | null => {
  const override = LABEL_TO_KIND_OVERRIDES[label];
  if (override) return override;
  const lower = label.toLowerCase() as ContactKind;
  return CONTACT_KINDS.includes(lower) ? lower : null;
};

/** Labels that are preserved (not editable here) when saving */
const PRESERVED_LABELS = new Set(['CV', 'Email', 'Github', 'Farcaster']);

/** Linked account types that appear as disabled pills in the editor */
const DISABLED_ACCOUNT_ITEMS: {
  type: string;
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { type: 'google_oauth', key: 'google', label: 'Google', icon: GoogleIcon },
  { type: 'github_oauth', key: 'github', label: 'GitHub', icon: GithubIcon },
  {
    type: 'farcaster',
    key: 'farcaster',
    label: 'Farcaster',
    icon: FarcasterIcon,
  },
];

interface UseManualLinksEditorParams {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ContactPillItem {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  disabled?: boolean;
  tooltip?: string;
  isConnected?: boolean;
}

export const useManualLinksEditor = ({
  isOpen,
  onOpenChange,
}: UseManualLinksEditorParams) => {
  const queryClient = useQueryClient();
  const { isSessionReady } = useSession();
  const { data: showcase } = useProfileShowcase(isSessionReady);
  const { data: linkedAccounts } = useLinkedAccounts();

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
        entries.push({ label: getSocialLabel(kind), url: template(handle) });
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

  // Editable contact pills
  const editablePills: ContactPillItem[] = CONTACT_KINDS.map((kind) => ({
    key: kind,
    label: CONTACT_LABELS[kind],
    icon: CONTACT_ICONS[kind],
  }));

  // Disabled linked-account pills (Google, GitHub, Farcaster)
  const disabledPills: ContactPillItem[] = DISABLED_ACCOUNT_ITEMS.map(
    (item) => {
      const linked = linkedAccounts?.find((a) => a.type === item.type);
      return {
        key: item.key,
        label: item.label,
        icon: item.icon,
        disabled: true,
        tooltip: 'Manage in Linked Accounts',
        isConnected: !!linked,
      };
    },
  );

  const pillItems: ContactPillItem[] = [...editablePills, ...disabledPills];

  const disabledKeys = new Set(disabledPills.map((p) => p.key));

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
    disabledKeys,
  };
};
