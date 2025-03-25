import { JobDetailsSchema } from '@/lib/jobs/core/schemas';

import { dtoToJobItem } from '@/lib/jobs/server/dtos/dto-to-job-item';
import { JobDetailsDto } from '@/lib/jobs/server/dtos/job-details-dto';

export const dtoToJobDetails = (dto: JobDetailsDto): JobDetailsSchema => {
  return {
    ...dtoToJobItem(dto),
    description: dto.description,
    requirements: dto.requirements,
    responsibilities: dto.responsibilities,
    benefits: dto.benefits,
    culture: dto.culture,
  };
};
