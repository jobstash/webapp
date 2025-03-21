import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { JobListActionResult } from '@/lib/jobs/server/actions';

export const flattenJobItems = (
  data: (JobListActionResult | undefined)[] | undefined,
): JobItemSchema[] => {
  if (!data || !Array.isArray(data)) return [];

  const items: JobItemSchema[] = [];

  for (const result of data) {
    if (result?.data) {
      items.push(...result.data.data);
    }
  }

  return items;
};
