import 'server-only';

import { ProjectAllInfoDto } from '@/lib/shared/core/dtos';
import { JobItemSchema } from '@/lib/jobs/core/schemas';

import { getLogoUrl } from '@/lib/shared/utils/get-logo-url';
import { prettyTimestamp } from '@/lib/shared/utils/pretty-timestamp';
import { createJobInfoTags } from '@/lib/jobs/utils/create-job-info-tags';
import { createJobOrgInfoTags } from '@/lib/jobs/utils/create-job-org-info-tags';
import { createProjectInfoTags } from '@/lib/jobs/utils/create-project-info-tags';
import { getJobTechColorIndex } from '@/lib/jobs/utils/get-job-tech-color-index';

import { JobItemDto } from './job-list-dtos';

const dtoToJobItemTag = (dto: JobItemDto['tags']): JobItemSchema['tags'] => {
  return dto.map((tag) => ({
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

export const dtoToJobItem = (jobItemDto: JobItemDto): JobItemSchema => {
  const {
    title,
    url,
    shortUUID,
    timestamp,
    access,
    tags,
    featured,
    featureEndDate,
    organization,
  } = jobItemDto;

  const infoTags = createJobInfoTags(jobItemDto);
  const mappedTags = dtoToJobItemTag(tags);
  const mappedOrg = dtoToJobItemOrg(organization);
  const projects = dtoToJobItemProjects(jobItemDto);
  const timestampText = prettyTimestamp(timestamp);

  return {
    id: shortUUID,
    title,
    url,
    timestampText,
    access,
    infoTags,
    tags: mappedTags,
    promotion: {
      isFeatured: featured,
      endDate: featureEndDate,
    },
    organization: mappedOrg,
    projects,
  };
};
