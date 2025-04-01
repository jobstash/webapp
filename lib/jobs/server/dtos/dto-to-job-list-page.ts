import 'server-only';

import { ENV } from '@/lib/shared/core/envs';
import { JobListPageSchema } from '@/lib/jobs/core/schemas';

import { dtoToJobItem } from './dto-to-job-item';

import { JobListPageDto } from '@/lib/jobs/server/dtos';

export const dtoToJobListPage = (dto: JobListPageDto): JobListPageSchema => {
  const data = dto.data.map(dtoToJobItem);
  const hasNextPage = dto.page > 0 && data.length >= ENV.PAGE_SIZE;
  return {
    page: dto.page,
    total: dto.total,
    data,
    hasNextPage,
  };
};
