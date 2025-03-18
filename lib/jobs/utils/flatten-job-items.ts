import { JobListItemSchema, JobListPageSchema } from '@/lib/jobs/core/schemas';

export const flattenJobItems = (
  pages: JobListPageSchema[] | unknown,
): JobListItemSchema[] => {
  if (!pages || !Array.isArray(pages)) return [];

  const result: JobListItemSchema[] = [];

  for (const page of pages) {
    if (page && page.data && Array.isArray(page.data.data)) {
      result.push(...page.data.data);
    }
  }

  return result;
};
