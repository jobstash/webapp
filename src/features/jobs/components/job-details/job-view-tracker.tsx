'use client';

import { useEffect } from 'react';

interface JobViewTrackerProps {
  shortUUID: string;
}

export const JobViewTracker = ({ shortUUID }: JobViewTrackerProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetch('/api/jobs/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shortUUID,
          eventType: 'job_view',
          eventId: crypto.randomUUID(),
          surface: 'job_details',
          dwellMs: 5000,
        }),
        keepalive: true,
      }).catch(() => undefined);
    }, 5000);

    return () => clearTimeout(timer);
  }, [shortUUID]);

  return null;
};
