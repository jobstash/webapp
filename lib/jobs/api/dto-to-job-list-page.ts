import 'server-only';

import { getOrgFundingInfo } from '@/lib/shared/utils/get-org-funding-info';
import { JobListPageSchema } from '../core/schemas';
import { JobListPageDto } from './dtos';
import { createJobInfoTags } from '@/lib/shared/utils/create-job-info-tags';
import { dtoToJobListItemProject } from './dto-to-job-list-item-project';

export const dtoToJobListPage = (dto: JobListPageDto): JobListPageSchema => ({
  page: dto.page,
  total: dto.total,
  data: dto.data.map((jobItemDto) => {
    const {
      id,
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
      id,
      title,
      url,
      shortUUID,
      timestamp,
      access,
      infoTags: createJobInfoTags(jobItemDto),
      tags,
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
});
