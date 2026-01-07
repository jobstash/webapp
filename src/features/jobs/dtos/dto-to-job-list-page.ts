import 'server-only';

import { JobListPageSchema } from '@/features/jobs/schemas';
import { dtoToJobListItem } from '@/features/jobs/dtos/dto-to-job-list-item';
import { JOBS_PER_PAGE } from '@/features/jobs/constants';

import { JobListPageDto } from './job-list-page.dto';

export const dtoToJobListPage = (dto: JobListPageDto): JobListPageSchema => {
  const data = dto.data.map(dtoToJobListItem);
  const hasNextPage = dto.page > 0 && data.length >= JOBS_PER_PAGE;
  return {
    page: dto.page,
    total: dto.total,
    data,
    hasNextPage,
  };
};
