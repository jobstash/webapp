import { z } from 'zod';

import { jobListItemDto } from '@/features/jobs/dtos/job-list-item.dto';

export const jobListPageDto = z.object({
  page: z.number(),
  count: z.number(),
  total: z.number(),
  data: jobListItemDto.array(),
});
export type JobListPageDto = z.infer<typeof jobListPageDto>;
