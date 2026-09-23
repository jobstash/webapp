'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useJobsRevision = () =>
  useQuery({
    queryKey: ['jobs-revision'],
    queryFn: async (): Promise<string> => {
      const response = await fetch('/api/jobs/revision', { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not check job updates');
      const data = await response.json();
      if (typeof data.revision !== 'string')
        throw new Error('Invalid job update status');
      return data.revision;
    },
    staleTime: 10_000,
    refetchInterval: 15_000,
    refetchOnWindowFocus: 'always',
  });

export const JobImportRefresh = () => {
  const { data: revision } = useJobsRevision();
  const previous = useRef<string>(undefined);
  const router = useRouter();
  const client = useQueryClient();
  useEffect(() => {
    if (!revision) return;
    if (previous.current && previous.current !== revision) {
      void client.invalidateQueries({ queryKey: ['recommended-jobs'] });
      router.refresh();
    }
    previous.current = revision;
  }, [revision, router, client]);
  return null;
};
