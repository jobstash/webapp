import 'server-only';
import { clientEnv } from '@/lib/env/client';

export const fetchJobsRevision = async (): Promise<string> => {
  const response = await fetch(`${clientEnv.MW_URL}/jobs/revision`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Could not load job update status');
  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== 'object' ||
    !('revision' in data) ||
    typeof data.revision !== 'string'
  ) {
    throw new Error('Invalid job update status');
  }
  return data.revision;
};
