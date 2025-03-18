import { JobListItemSchema } from '@/lib/jobs/core/schemas';

import { JobListActionResult } from '@/lib/jobs/server/actions';

export const flattenJobItems = (
  data: (JobListActionResult | undefined)[] | undefined,
): JobListItemSchema[] => {
  if (!data || !Array.isArray(data)) return [];

  const items: JobListItemSchema[] = [];

  for (const result of data) {
    if (result?.data) {
      items.push(...result.data.data);
    }
  }

  return items;
};
