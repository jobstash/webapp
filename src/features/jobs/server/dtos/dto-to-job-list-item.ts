import 'server-only';

import { capitalize } from '@/lib/utils';
import {
  formatNumber,
  getLogoUrl,
  prettyTimestamp,
  shortTimestamp,
  slugify,
  titleCase,
} from '@/lib/server/utils';
import { type JobListItemDto } from './job-list-item.dto';
import { type JobListItemSchema } from '@/features/jobs/schemas';
import { MappedInfoTagSchema } from '@/lib/schemas';
import { SENIORITY_MAPPING } from '@/lib/constants';
import { FundingRoundDto } from '@/lib/server/dtos';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';

export const dtoToJobListItem = (dto: JobListItemDto): JobListItemSchema => {
  const {
    title,
    url: applyUrl,
    shortUUID,
    timestamp,
    summary,
    tags,
    organization,
  } = dto;

  const href = createJobItemHref(dto);
  const infoTags = createJobInfoTags(dto);
  const mappedTags = dtoToJobItemTag(tags);
  const mappedOrg = dtoToJobItemOrg(organization);
  const badge = dtoToJobItemBadge(dto);
  const isUrgentlyHiring = !!badge && badge === JOB_ITEM_BADGE.BEGINNER;
  const timestampText = isUrgentlyHiring
    ? 'Urgently Hiring'
    : prettyTimestamp(timestamp);

  return {
    id: shortUUID,
    title,
    href,
    applyUrl,
    summary,
    infoTags,
    tags: mappedTags,
    organization: mappedOrg,
    badge,
    timestampText,
  };
};

const createJobItemHref = (dto: JobListItemDto) => {
  const orgText = dto.organization?.name ? `-${dto.organization?.name}` : '';
  const slug = slugify(`${dto.title}${orgText}`);
  return `/${slug}/${dto.shortUUID}`;
};

const createJobInfoTags = (dto: JobListItemDto) => {
  const {
    seniority,
    locationType,
    location,
    commitment,
    paysInCrypto,
    offersTokenAllocation,
    classification,
  } = dto;

  const tags: MappedInfoTagSchema[] = [];

  if (seniority && seniority in SENIORITY_MAPPING) {
    tags.push({
      iconKey: 'seniority',
      label: SENIORITY_MAPPING[seniority as keyof typeof SENIORITY_MAPPING],
    });
  }

  const salaryText = getSalaryText(dto);
  if (salaryText) {
    tags.push({
      iconKey: 'salary',
      label: `Salary: ${salaryText}`,
    });
  }

  if (location) {
    tags.push({
      iconKey: 'location',
      label: capitalize(location),
    });
  }

  if (locationType) {
    tags.push({
      iconKey: 'workMode',
      label: capitalize(locationType, true),
    });
  }

  if (commitment) {
    tags.push({
      iconKey: 'commitment',
      label: titleCase(commitment),
    });
  }

  if (paysInCrypto) {
    tags.push({
      iconKey: 'paysInCrypto',
      label: 'Pays in Crypto',
    });
  }

  if (offersTokenAllocation) {
    tags.push({
      iconKey: 'offersTokenAllocation',
      label: 'Token Allocation',
    });
  }

  if (classification) {
    tags.push({
      iconKey: 'category',
      label: titleCase(classification),
    });
  }

  return tags;
};

const getSalaryText = (dto: JobListItemDto) => {
  const { minimumSalary, maximumSalary, salary, salaryCurrency } = dto;

  if (minimumSalary && maximumSalary) {
    return `${formatNumber(minimumSalary)} - ${formatNumber(maximumSalary)}`;
  }

  if (salary && salaryCurrency)
    return `${formatNumber(salary)} ${salaryCurrency}`;

  return null;
};

const getJobTechColorIndex = (uuid: string) => {
  const COLOR_COUNT = 12;

  let pseudorandomBytes =
    uuid.slice(0, 14) + uuid.slice(15, 19) + uuid.slice(20);
  pseudorandomBytes = pseudorandomBytes.replaceAll('-', '');
  let accumulator = 0;

  const pseudoMatch = pseudorandomBytes.match(/.{1,8}/g);
  if (!pseudoMatch) return 0;

  for (const a of pseudoMatch) {
    accumulator =
      (accumulator + (Number.parseInt(a, 16) % COLOR_COUNT)) % COLOR_COUNT;
  }

  return accumulator;
};

const dtoToJobItemTag = (
  dto: JobListItemDto['tags'],
): JobListItemSchema['tags'] => {
  return dto.map((tag) => ({
    id: tag.id,
    name: tag.name,
    normalizedName: tag.normalizedName,
    colorIndex: getJobTechColorIndex(tag.id),
  }));
};

const getOrgFundingInfo = (fundingRounds: FundingRoundDto[] = []) => {
  let lastFundingAmount = null;
  let lastFundingDate = null;

  if (fundingRounds.length > 0) {
    for (const fundingRound of fundingRounds) {
      if (fundingRound.date && fundingRound.date > (lastFundingDate ?? 0)) {
        lastFundingDate = fundingRound.date;
        lastFundingAmount = fundingRound.raisedAmount ?? 0;
      }
    }
  }

  return {
    lastDate: lastFundingDate ? `${shortTimestamp(lastFundingDate)}` : null,
    lastAmount: lastFundingAmount
      ? `${formatNumber(lastFundingAmount * 1_000_000)}`
      : null,
  };
};

const createJobOrgInfoTags = (
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

const dtoToJobItemOrg = (
  dto: JobListItemDto['organization'],
): JobListItemSchema['organization'] => {
  if (!dto) return null;

  return {
    name: dto.name,
    logo: getLogoUrl(dto.website, dto.logoUrl),
    location: dto.location,
    infoTags: createJobOrgInfoTags(dto),
    url: dto.logoUrl,
  };
};

const dtoToJobItemBadge = (dto: JobListItemDto): JobListItemSchema['badge'] => {
  const { featured, access, onboardIntoWeb3 } = dto;

  if (featured) return JOB_ITEM_BADGE.FEATURED;
  if (access === 'protected') return JOB_ITEM_BADGE.EXPERT;
  if (onboardIntoWeb3) return JOB_ITEM_BADGE.BEGINNER;

  return null;
};
