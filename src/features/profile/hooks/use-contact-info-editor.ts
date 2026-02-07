import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/hooks/use-session';
import { useProfileShowcase } from '@/features/profile/hooks/use-profile-showcase';
import type { ShowcaseItem } from '@/features/profile/schemas';

type ContactKind = 'email' | 'website';

const normalizeWebsiteUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

interface UseContactInfoEditorParams {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const useContactInfoEditor = ({
  isOpen,
  onOpenChange,
}: UseContactInfoEditorParams) => {
  const queryClient = useQueryClient();
  const { isSessionReady } = useSession();
  const { data: showcase } = useProfileShowcase(isSessionReady);

  const [selectedKinds, setSelectedKinds] = useState<Set<ContactKind>>(
    new Set(),
  );
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const items = showcase ?? [];
    const selected = new Set<ContactKind>();

    const emailItem = items.find((i) => i.label === 'Email');
    if (emailItem) {
      selected.add('email');
      setEmail(emailItem.url);
    } else {
      setEmail('');
    }

    const websiteItem = items.find((i) => i.label === 'Website');
    if (websiteItem) {
      selected.add('website');
      setWebsiteUrl(websiteItem.url);
    } else {
      setWebsiteUrl('');
    }

    setSelectedKinds(selected);
    setError(null);
  }, [isOpen, showcase]);

  const toggleKind = (kind: string) => {
    setSelectedKinds((prev) => {
      const next = new Set(prev);
      if (next.has(kind as ContactKind)) {
        next.delete(kind as ContactKind);
      } else {
        next.add(kind as ContactKind);
      }
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const items = showcase ?? [];

      const preserved: ShowcaseItem[] = items.filter(
        (item) => item.label !== 'Email' && item.label !== 'Website',
      );

      const entries: { label: string; url: string }[] = [...preserved];

      if (selectedKinds.has('email') && email.trim()) {
        entries.push({ label: 'Email', url: email.trim() });
      }

      if (selectedKinds.has('website') && websiteUrl.trim()) {
        entries.push({
          label: 'Website',
          url: normalizeWebsiteUrl(websiteUrl),
        });
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
      setError('Failed to save contact info. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedKinds,
    toggleKind,
    email,
    setEmail,
    websiteUrl,
    setWebsiteUrl,
    isSaving,
    error,
    handleSave,
  };
};
