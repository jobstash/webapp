import 'server-only';

import { JobListPageSchema } from '@/lib/jobs/core/schemas';

import { getOrgFundingInfo } from '@/lib/shared/utils/get-org-funding-info';
import { createJobInfoTags } from '@/lib/jobs/utils/create-job-info-tags';
import { getJobTechColorIndex } from '@/lib/jobs/utils/get-job-tech-color-index';

import { dtoToJobListItemProject } from './dto-to-job-list-item-project';
import { JobListItemDto, JobListPageDto } from './job-list-dtos';

const dtoToJobListItemTag = (dto: JobListItemDto['tags']) => {
  return dto.map((tag) => ({
    name: tag.name,
    normalizedName: tag.normalizedName,
    colorIndex: getJobTechColorIndex(tag.id),
  }));
};

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

export const dtoToJobListPage = (dto: JobListPageDto): JobListPageSchema => {
  return {
    page: dto.page,
    total: dto.total,
    data: dto.data.map((jobItemDto) => {
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
    }),
  };
};
