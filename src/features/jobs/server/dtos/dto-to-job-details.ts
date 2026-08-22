import 'server-only';

import { getLogoUrl, prettyTimestamp, slugify } from '@/lib/server/utils';
import { type JobDetailsDto } from './job-details.dto';
import { type SimilarJobItemDto } from './similar-job.dto';
import { dtoToJobListItem } from './dto-to-job-list-item';
import {
  type JobDetailsSchema,
  type SimilarJobSchema,
} from '@/features/jobs/schemas';

export const dtoToSimilarJob = (dto: SimilarJobItemDto): SimilarJobSchema => {
  const { shortUUID, timestamp, organization, project } = dto;
  const employer = organization ?? project;

  const title =
    dto.title ?? (employer?.name ? `Role at ${employer.name}` : 'Open Role');
  const employerSlug = employer?.name ? `-${employer.name}` : '';
  const href = `/${slugify(`${title}${employerSlug}`)}/${shortUUID}`;

  const normalizedName = employer?.normalizedName;
  const id = normalizedName ? `${shortUUID}-${normalizedName}` : shortUUID;

  return {
    id,
    title,
    href,
    timestampText: prettyTimestamp(timestamp),
    companyName: employer?.name ?? null,
    companyLogo: employer
      ? getLogoUrl(
          employer.website,
          organization?.logoUrl ?? project?.logo ?? null,
        )
      : null,
  };
};

export const dtoToJobDetails = (
  dto: JobDetailsDto,
  similarJobsDto: SimilarJobItemDto[] = [],
): JobDetailsSchema => {
  const baseItem = dtoToJobListItem(dto);
  const similarJobs = similarJobsDto.map(dtoToSimilarJob);

  return {
    ...baseItem,
    description: dto.description,
    requirements: dto.requirements ?? [],
    responsibilities: dto.responsibilities ?? [],
    benefits: dto.benefits ?? [],
    culture: dto.culture,
    hiringProcess: dto.hiringProcess ?? null,
    similarJobs,
  };
};
