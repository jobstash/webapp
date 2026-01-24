import 'server-only';

import { lookupAddresses } from '@/lib/server/address-lookup';
import { formatNumber, getLogoUrl, slugify } from '@/lib/server/utils';
import { type JobDetailsDto } from './job-details.dto';
import { type SimilarJobDto } from './similar-job.dto';
import { dtoToJobListItem } from './dto-to-job-list-item';
import {
  type JobDetailsSchema,
  type SimilarJobSchema,
} from '@/features/jobs/schemas';

const getSimilarJobDefaultTitle = (dto: SimilarJobDto): string =>
  dto.organization?.name ? `Role at ${dto.organization.name}` : 'Open Role';

export const dtoToSimilarJob = (dto: SimilarJobDto): SimilarJobSchema => {
  const {
    shortUUID,
    minimumSalary,
    maximumSalary,
    salary,
    salaryCurrency,
    location,
    organization,
  } = dto;

  const title = dto.title ?? getSimilarJobDefaultTitle(dto);
  const orgSlug = organization?.name ? `-${organization.name}` : '';
  const href = `/${slugify(`${title}${orgSlug}`)}/${shortUUID}`;

  let salaryText: string | null = null;
  if (minimumSalary && maximumSalary) {
    salaryText = `${formatNumber(minimumSalary)} - ${formatNumber(maximumSalary)}`;
  } else if (salary && salaryCurrency) {
    salaryText = `${formatNumber(salary)} ${salaryCurrency}`;
  }

  return {
    id: shortUUID,
    title,
    href,
    salaryText,
    addresses: lookupAddresses(location),
    companyName: organization?.name ?? null,
    companyLogo: organization
      ? getLogoUrl(organization.website, organization.logoUrl)
      : null,
  };
};

export const dtoToJobDetails = (
  dto: JobDetailsDto,
  similarJobsDto: SimilarJobDto[] = [],
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
