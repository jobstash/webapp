import 'server-only';

import { JobListPageSchema } from '@/features/jobs/schemas';
import { dtoToJobListItem } from './dto-to-job-list-item';

import { JobListPageDto } from './job-list-page.dto';

export const dtoToJobListPage = (dto: JobListPageDto): JobListPageSchema => {
  const data = dto.data.map(dtoToJobListItem);
  return {
    page: dto.page,
    total: dto.total,
    data,
  };
};
