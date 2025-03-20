import 'server-only';

import { ProjectAllInfoDto } from '@/lib/shared/core/dtos';
import { JobListItemSchema } from '@/lib/jobs/core/schemas';

import { createJobInfoTags } from '@/lib/jobs/utils/create-job-info-tags';
import { createJobOrgInfoTags } from '@/lib/jobs/utils/create-job-org-info-tags';
import { createProjectInfoTags } from '@/lib/jobs/utils/create-project-info-tags';
import { getJobTechColorIndex } from '@/lib/jobs/utils/get-job-tech-color-index';

import { JobListItemDto } from './job-list-dtos';

const dtoToJobListItemTag = (dto: JobListItemDto['tags']): JobListItemSchema['tags'] => {
  return dto.map((tag) => ({
    name: tag.name,
    normalizedName: tag.normalizedName,
    colorIndex: getJobTechColorIndex(tag.id),
  }));
};

export const dtoToJobListItemProject = (
  dto: ProjectAllInfoDto,
): JobListItemSchema['projects'][number] => ({
  name: dto.name,
  website: dto.website,
  logo: dto.logo,
  chains: dto.chains.map((chain) => chain.logo).filter(Boolean) as string[],
  tags: createProjectInfoTags(dto),
});

export const dtoToJobListItemProjects = (
  dto: JobListItemDto,
): JobListItemSchema['projects'] => {
  const project = dto.project;
  const orgProjects = dto.organization?.projects ?? [];

  return [
    ...(project ? [dtoToJobListItemProject(project)] : []),
    ...orgProjects.map(dtoToJobListItemProject),
  ];
};

const dtoToJobListItemOrg = (
  dto: JobListItemDto['organization'],
): JobListItemSchema['organization'] => {
  if (!dto) return null;

  return {
    name: dto.name,
    website: dto.website,
    logo: dto.logoUrl,
    location: dto.location,
    infoTags: createJobOrgInfoTags(dto),
  };
};

export const dtoToJobListItem = (jobItemDto: JobListItemDto): JobListItemSchema => {
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
  const mappedTags = dtoToJobListItemTag(tags);
  const mappedOrg = dtoToJobListItemOrg(organization);
  const projects = dtoToJobListItemProjects(jobItemDto);

  return {
    id: shortUUID,
    title,
    url,
    timestamp,
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
