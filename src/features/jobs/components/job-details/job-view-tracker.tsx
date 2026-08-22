'use client';

import { useEffect } from 'react';

interface JobViewTrackerProps {
  shortUUID: string;
}

export const JobViewTracker = ({ shortUUID }: JobViewTrackerProps) => {
  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/jobs/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shortUUID }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => undefined);

    return () => controller.abort();
  }, [shortUUID]);

  return null;
};
