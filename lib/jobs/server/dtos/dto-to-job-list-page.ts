import 'server-only';

import { JobListPageSchema } from '@/lib/jobs/core/schemas';

import { dtoToJobListItem } from './dto-to-job-list-item';

import { JobListPageDto } from '@/lib/jobs/server/dtos/job-list-dtos';

export const dtoToJobListPage = (dto: JobListPageDto): JobListPageSchema => {
  return {
    page: dto.page,
    total: dto.total,
    data: dto.data.map(dtoToJobListItem),
  };
};
