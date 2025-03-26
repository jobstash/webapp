import 'server-only';

import { ProjectAllInfoDto } from '@/lib/shared/core/dtos';
import { jobBadgeLabels } from '@/lib/jobs/core/constants';
import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { getLogoUrl } from '@/lib/shared/utils/get-logo-url';
import { prettyTimestamp } from '@/lib/shared/utils/pretty-timestamp';
import { createJobInfoTags } from '@/lib/jobs/utils/create-job-info-tags';
import { createJobItemHref } from '@/lib/jobs/utils/create-job-item-href';
import { createJobOrgInfoTags } from '@/lib/jobs/utils/create-job-org-info-tags';
import { createProjectInfoTags } from '@/lib/jobs/utils/create-project-info-tags';
import { getJobTechColorIndex } from '@/lib/jobs/utils/get-job-tech-color-index';

import { JobItemDto } from './job-item-dto';

const dtoToJobItemTag = (dto: JobItemDto['tags']): JobItemSchema['tags'] => {
  return dto.map((tag) => ({
    id: tag.id,
    name: tag.name,
    normalizedName: tag.normalizedName,
    colorIndex: getJobTechColorIndex(tag.id),
  }));
};

export const dtoToJobItemProject = (
  dto: ProjectAllInfoDto,
): JobItemSchema['projects'][number] => ({
  name: dto.name,
  website: dto.website,
  logo: getLogoUrl(dto.website, dto.logo),
  chains: dto.chains.map((chain) => chain.logo).filter(Boolean) as string[],
  infoTags: createProjectInfoTags(dto),
});

export const dtoToJobItemProjects = (dto: JobItemDto): JobItemSchema['projects'] => {
  const project = dto.project;
  const orgProjects = dto.organization?.projects ?? [];

  return [
    ...(project ? [dtoToJobItemProject(project)] : []),
    ...orgProjects.map(dtoToJobItemProject),
  ];
};

const dtoToJobItemOrg = (
  dto: JobItemDto['organization'],
): JobItemSchema['organization'] => {
  if (!dto) return null;

  return {
    name: dto.name,
    website: dto.website,
    logo: dto.logoUrl,
    location: dto.location,
    infoTags: createJobOrgInfoTags(dto),
  };
};

export const dtoToJobItemBadge = (dto: JobItemDto): JobItemSchema['badge'] => {
  const { featured, access, onboardIntoWeb3 } = dto;

  if (featured) return jobBadgeLabels.FEATURED;
  if (access === 'protected') return jobBadgeLabels.EXPERT;
  if (onboardIntoWeb3) return jobBadgeLabels.BEGINNER;

  return null;
};

export const dtoToJobItem = (jobItemDto: JobItemDto): JobItemSchema => {
  const {
    title,
    url,
    shortUUID,
    timestamp,
    access,
    summary,
    tags,
    featured,
    featureEndDate,
    organization,
    onboardIntoWeb3,
  } = jobItemDto;

  const href = createJobItemHref(jobItemDto);
  const infoTags = createJobInfoTags(jobItemDto);
  const mappedTags = dtoToJobItemTag(tags);
  const mappedOrg = dtoToJobItemOrg(organization);
  const projects = dtoToJobItemProjects(jobItemDto);
  const hasGradientBorder = featured || access === 'protected' || onboardIntoWeb3;
  const badge = dtoToJobItemBadge(jobItemDto);
  const isUrgentlyHiring = featured || access === 'protected';
  const timestampText = isUrgentlyHiring ? 'Urgently Hiring' : prettyTimestamp(timestamp);

  return {
    id: shortUUID,
    title,
    href,
    url,
    access,
    summary,
    infoTags,
    tags: mappedTags,
    organization: mappedOrg,
    projects,
    promotionEndDate: featureEndDate,
    hasGradientBorder,
    badge,
    isUrgentlyHiring,
    timestampText,
  };
};
