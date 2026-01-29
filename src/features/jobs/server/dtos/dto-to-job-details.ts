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
  const { shortUUID, timestamp, organization } = dto;

  const title =
    dto.title ??
    (organization?.name ? `Role at ${organization.name}` : 'Open Role');
  const orgSlug = organization?.name ? `-${organization.name}` : '';
  const href = `/${slugify(`${title}${orgSlug}`)}/${shortUUID}`;

  const normalizedName = organization?.normalizedName;
  const id = normalizedName ? `${shortUUID}-${normalizedName}` : shortUUID;

  return {
    id,
    title,
    href,
    timestampText: prettyTimestamp(timestamp),
    companyName: organization?.name ?? null,
    companyLogo: organization
      ? getLogoUrl(organization.website, organization.logoUrl)
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
    similarJobs,
  };
};
