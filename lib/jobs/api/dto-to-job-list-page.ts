import 'server-only';

import { addBreadcrumb } from '@sentry/nextjs';

import { JobListPageSchema } from '@/lib/jobs/core/schemas';

import { createJobInfoTags } from '@/lib/shared/utils/create-job-info-tags';
import { getOrgFundingInfo } from '@/lib/shared/utils/get-org-funding-info';
import { getJobTechColorIndex } from '@/lib/jobs/utils/get-job-tech-color-index';

import { dtoToJobListItemProject } from './dto-to-job-list-item-project';
import { JobListPageDto } from './dtos';

export const dtoToJobListPage = (dto: JobListPageDto): JobListPageSchema => {
  addBreadcrumb({
    type: 'info',
    message: 'transform::dtoToJobListPage',
    data: {
      page: dto.page,
      items: dto.data.length,
    },
  });

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

      return {
        id: shortUUID,
        title,
        url,
        timestamp,
        access,
        infoTags: createJobInfoTags(jobItemDto),
        tags: tags.map((tag) => ({
          name: tag.name,
          normalizedName: tag.normalizedName,
          colorIndex: getJobTechColorIndex(tag.id),
        })),
        promotion: {
          isFeatured: featured,
          endDate: featureEndDate,
        },
        organization: organization
          ? {
              name: organization.name,
              website: organization.website,
              logo: organization.logoUrl,
              projects: organization.projects.map((projectDto) =>
                dtoToJobListItemProject(projectDto),
              ),
              funding: getOrgFundingInfo(organization?.fundingRounds ?? []),
            }
          : null,

        project: project ? dtoToJobListItemProject(project) : null,
      };
    }),
  };
};
