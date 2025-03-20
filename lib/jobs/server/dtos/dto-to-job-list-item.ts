import 'server-only';

import { ProjectAllInfoDto } from '@/lib/shared/core/dtos';

import { getOrgFundingInfo } from '@/lib/shared/utils/get-org-funding-info';
import { createJobInfoTags } from '@/lib/jobs/utils/create-job-info-tags';
import { createProjectInfoTags } from '@/lib/jobs/utils/create-project-info-tags';
import { getJobTechColorIndex } from '@/lib/jobs/utils/get-job-tech-color-index';

import { JobListItemDto } from './job-list-dtos';

const dtoToJobListItemTag = (dto: JobListItemDto['tags']) => {
  return dto.map((tag) => ({
    name: tag.name,
    normalizedName: tag.normalizedName,
    colorIndex: getJobTechColorIndex(tag.id),
  }));
};

export const dtoToJobListItemProject = (dto: ProjectAllInfoDto) => ({
  name: dto.name,
  website: dto.website,
  logo: dto.logo,
  chains: dto.chains.map((chain) => chain.logo).filter(Boolean) as string[],
  tags: createProjectInfoTags(dto),
});

const dtoToJobListItemOrg = (dto: JobListItemDto['organization']) => {
  if (!dto) return null;

  const projects = dto.projects.map(dtoToJobListItemProject);
  const funding = getOrgFundingInfo(dto?.fundingRounds ?? []);

  return {
    name: dto.name,
    website: dto.website,
    logo: dto.logoUrl,
    projects,
    funding,
  };
};

export const dtoToJobListItem = (jobItemDto: JobListItemDto) => {
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
    project,
  } = jobItemDto;

  const infoTags = createJobInfoTags(jobItemDto);
  const mappedTags = dtoToJobListItemTag(tags);
  const mappedOrg = dtoToJobListItemOrg(organization);
  const mappedProject = project ? dtoToJobListItemProject(project) : null;

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
    project: mappedProject,
  };
};
