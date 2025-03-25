import 'server-only';

import { JobListPageSchema } from '@/lib/jobs/core/schemas';

import { dtoToJobItem } from './dto-to-job-item';

import { JobListPageDto } from '@/lib/jobs/server/dtos';

export const dtoToJobListPage = (dto: JobListPageDto): JobListPageSchema => {
  return {
    page: dto.page,
    total: dto.total,
    data: dto.data.map(dtoToJobItem),
  };
};
