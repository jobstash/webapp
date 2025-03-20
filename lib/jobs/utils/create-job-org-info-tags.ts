import { MappedInfoTagSchema } from '@/lib/shared/core/schemas';

import { getOrgFundingInfo } from '@/lib/shared/utils/get-org-funding-info';

import { JobListItemDto } from '@/lib/jobs/server/dtos';

export const createJobOrgInfoTags = (
  dto: JobListItemDto['organization'],
): MappedInfoTagSchema[] => {
  if (!dto) return [];

  const { fundingRounds, headcountEstimate } = dto;
  const { lastAmount, lastDate } = getOrgFundingInfo(fundingRounds);

  const infoTags: MappedInfoTagSchema[] = [];
  if (lastAmount) {
    infoTags.push({
      iconKey: 'lastFundingAmount',
      label: `Last Funding: $${lastAmount}`,
    });
  }

  if (lastDate) {
    infoTags.push({
      iconKey: 'lastFundingDate',
      label: `Funding Date: ${lastDate}`,
    });
  }

  if (headcountEstimate) {
    infoTags.push({
      iconKey: 'employees',
      label: `Employees: ${headcountEstimate}`,
    });
  }

  return infoTags;
};
