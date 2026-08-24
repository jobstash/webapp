import 'server-only';

import { clientEnv } from '@/lib/env/client';
import { publicProfileResponseSchema, type PublicProfile } from '../../schemas';

export const fetchPublicProfile = async (
  slug: string,
): Promise<PublicProfile | null> => {
  const response = await fetch(
    `${clientEnv.MW_URL}/profiles/${encodeURIComponent(slug)}`,
    { cache: 'no-store' },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Public profile request failed: ${response.status}`);
  }

  const payload: unknown = await response.json();
  const parsed = publicProfileResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error('Public profile response failed validation');
  }

  return parsed.data.data;
};
