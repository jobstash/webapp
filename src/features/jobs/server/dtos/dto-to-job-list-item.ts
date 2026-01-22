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
import {
  type JobFundingRoundSchema,
  type JobInvestorSchema,
  type JobListItemSchema,
  type JobOrganizationSchema,
} from '@/features/jobs/schemas';
import { MappedInfoTagSchema } from '@/lib/schemas';
import { SENIORITY_MAPPING } from '@/lib/constants';
import { FundingRoundDto, InvestorDto } from '@/lib/server/dtos';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';

const createFilterUrl = (param: string, value: string) =>
  `/?${param}=${encodeURIComponent(value)}`;

const getDefaultTitle = (dto: JobListItemDto): string => {
  const seniority =
    dto.seniority && dto.seniority in SENIORITY_MAPPING
      ? SENIORITY_MAPPING[dto.seniority as keyof typeof SENIORITY_MAPPING]
      : null;
  const classification = dto.classification
    ? titleCase(dto.classification)
    : null;
  const orgName = dto.organization?.name ?? null;

  const role = classification ?? 'Role';
  const roleWithSeniority = seniority ? `${seniority} ${role}` : role;
  const title = orgName
    ? `${roleWithSeniority} at ${orgName}`
    : roleWithSeniority;

  return title || 'Open Role';
};

export const dtoToJobListItem = (dto: JobListItemDto): JobListItemSchema => {
  const {
    url: applyUrl,
    shortUUID,
    timestamp,
    summary,
    tags,
    organization,
  } = dto;

  const title = dto.title ?? getDefaultTitle(dto);
  const href = createJobItemHref(title, dto);
  const infoTags = createJobInfoTags(dto);
  const mappedTags = dtoToJobItemTag(tags);
  const mappedOrg = dtoToJobItemOrg(organization);
  const badge = dtoToJobItemBadge(dto);
  const timestampText = prettyTimestamp(timestamp);

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

const createJobItemHref = (title: string, dto: JobListItemDto) => {
  const orgText = dto.organization?.name ? `-${dto.organization?.name}` : '';
  const slug = slugify(`${title}${orgText}`);
  return `/${slug}/${dto.shortUUID}`;
};

const createJobInfoTags = (dto: JobListItemDto) => {
  const {
    timestamp,
    seniority,
    locationType,
    location,
    commitment,
    paysInCrypto,
    offersTokenAllocation,
    classification,
  } = dto;

  const tags: MappedInfoTagSchema[] = [];

  // First tag: "Urgently Hiring" for expert jobs, timestamp for others
  const badge = dtoToJobItemBadge(dto);
  const isExpertJob = badge === JOB_ITEM_BADGE.EXPERT;

  if (isExpertJob) {
    tags.push({
      iconKey: 'urgentlyHiring',
      label: 'Urgently Hiring',
    });
  } else {
    tags.push({
      iconKey: 'posted',
      label: prettyTimestamp(timestamp),
    });
  }

  if (seniority && seniority in SENIORITY_MAPPING) {
    const label =
      SENIORITY_MAPPING[seniority as keyof typeof SENIORITY_MAPPING];
    tags.push({
      iconKey: 'seniority',
      label,
      href: `/s-${slugify(label)}`,
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
      href: `/l-${slugify(location)}`,
    });
  }

  const isRedundantRemote =
    location?.toLowerCase() === 'remote' &&
    locationType?.toLowerCase() === 'remote';

  if (locationType && !isRedundantRemote) {
    tags.push({
      iconKey: 'workMode',
      label: capitalize(locationType, true),
      href: `/lt-${slugify(locationType)}`,
    });
  }

  if (commitment) {
    tags.push({
      iconKey: 'commitment',
      label: titleCase(commitment),
      href: `/co-${slugify(commitment)}`,
    });
  }

  if (paysInCrypto) {
    tags.push({
      iconKey: 'paysInCrypto',
      label: 'Pays in Crypto',
      href: createFilterUrl('paysInCrypto', 'true'),
    });
  }

  if (offersTokenAllocation) {
    tags.push({
      iconKey: 'offersTokenAllocation',
      label: 'Token Allocation',
      href: createFilterUrl('offersTokenAllocation', 'true'),
    });
  }

  if (classification) {
    tags.push({
      iconKey: 'category',
      label: titleCase(classification),
      href: `/cl-${slugify(classification)}`,
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
    name: titleCase(tag.name),
    normalizedName: tag.normalizedName,
    colorIndex: getJobTechColorIndex(tag.id),
  }));
};

const dtoToFundingRounds = (
  fundingRounds: FundingRoundDto[],
): JobFundingRoundSchema[] => {
  return fundingRounds
    .sort((a, b) => (b.date ?? 0) - (a.date ?? 0))
    .map((fr) => ({
      roundName: fr.roundName ?? null,
      amount: fr.raisedAmount
        ? `$${formatNumber(fr.raisedAmount * 1_000_000)}`
        : null,
      date: fr.date ? shortTimestamp(fr.date) : null,
      href: fr.roundName ? `/fr-${slugify(fr.roundName)}` : null,
    }));
};

const dtoToInvestors = (investors: InvestorDto[]): JobInvestorSchema[] => {
  return investors.map((inv) => ({
    name: inv.name,
    href: `/i-${inv.normalizedName}`,
  }));
};

const createOrgInfoTags = (
  dto: NonNullable<JobListItemDto['organization']>,
  href: string,
): MappedInfoTagSchema[] => {
  const { name, location, headcountEstimate } = dto;
  const tags: MappedInfoTagSchema[] = [];

  if (location) {
    tags.push({
      iconKey: 'orgLocation',
      label: capitalize(location),
    });
  }

  if (headcountEstimate) {
    tags.push({
      iconKey: 'employees',
      label: `${headcountEstimate} Employees`,
    });
  }

  tags.push({
    iconKey: 'externalLink',
    label: `Jobs by ${name}`,
    href,
  });

  return tags;
};

const dtoToJobItemOrg = (
  dto: JobListItemDto['organization'],
): JobOrganizationSchema | null => {
  if (!dto) return null;

  const {
    name,
    normalizedName,
    website,
    location,
    logoUrl,
    headcountEstimate,
    fundingRounds,
    investors,
  } = dto;

  const href = `/o-${normalizedName}`;

  return {
    name,
    href,
    websiteUrl: website,
    location,
    logo: getLogoUrl(website, logoUrl),
    employeeCount: headcountEstimate ? `${headcountEstimate}` : null,
    fundingRounds: dtoToFundingRounds(fundingRounds),
    investors: dtoToInvestors(investors),
    infoTags: createOrgInfoTags(dto, href),
  };
};

const dtoToJobItemBadge = (dto: JobListItemDto): JobListItemSchema['badge'] => {
  const { featured, access, onboardIntoWeb3 } = dto;

  if (featured) return JOB_ITEM_BADGE.FEATURED;
  if (access === 'protected') return JOB_ITEM_BADGE.EXPERT;
  if (onboardIntoWeb3) return JOB_ITEM_BADGE.BEGINNER;

  return null;
};
