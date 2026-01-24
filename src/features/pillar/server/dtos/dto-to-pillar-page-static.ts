import 'server-only';

import type { PillarPageStatic } from '@/features/pillar/schemas';
import { dtoToJobListItem } from '@/features/jobs/server/dtos/dto-to-job-list-item';

import type { PillarPageStaticDto } from './pillar-page-static.dto';

export const dtoToPillarPageStatic = (
  dto: PillarPageStaticDto,
): PillarPageStatic => ({
  title: dto.data.title,
  description: dto.data.description,
  jobs: dto.data.jobs.map(dtoToJobListItem),
});
