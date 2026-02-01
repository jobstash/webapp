import { useRef, useState } from 'react';

import type { OnboardingData } from '@/features/onboarding/schemas';
import { GA_EVENT, trackEvent } from '@/lib/analytics';

type SyncStatus = 'idle' | 'syncing' | 'done';

const hasData = (data: OnboardingData): boolean =>
  data.selectedSkills.length > 0 || data.parsedResume !== null;

export const useOnboardingSync = () => {
  const [status, setStatus] = useState<SyncStatus>('idle');
  const hasStarted = useRef(false);

  const sync = async (data: OnboardingData): Promise<void> => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    if (!hasData(data)) {
      setStatus('done');
      return;
    }

    setStatus('syncing');

    try {
      const body = {
        skills: data.selectedSkills.map((s) => ({
          id: s.id,
          name: s.name,
        })),
        socials: data.parsedResume?.socials ?? [],
        email: data.parsedResume?.email ?? null,
        resume: data.parsedResume
          ? {
              resumeId: data.parsedResume.resumeId,
              fileName: data.parsedResume.fileName,
            }
          : null,
      };

      const res = await fetch('/api/onboarding/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      trackEvent(GA_EVENT.ONBOARDING_PROFILE_SYNCED, {
        skills_count: data.selectedSkills.length,
        socials_count: data.parsedResume?.socials.length ?? 0,
        has_resume: data.parsedResume !== null,
        success: res.ok,
      });
    } catch {
      // Never block redirect on sync failure
    } finally {
      setStatus('done');
    }
  };

  return { status, sync };
};
