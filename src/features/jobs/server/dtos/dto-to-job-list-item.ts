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

  // Timestamp as first tag (not filterable)
  tags.push({
    iconKey: 'posted',
    label: prettyTimestamp(timestamp),
  });

  if (seniority && seniority in SENIORITY_MAPPING) {
    tags.push({
      iconKey: 'seniority',
      label: SENIORITY_MAPPING[seniority as keyof typeof SENIORITY_MAPPING],
      href: createFilterUrl('seniority', seniority),
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
      href: createFilterUrl('location', location),
    });
  }

  const isRedundantRemote =
    location?.toLowerCase() === 'remote' &&
    locationType?.toLowerCase() === 'remote';

  if (locationType && !isRedundantRemote) {
    tags.push({
      iconKey: 'workMode',
      label: capitalize(locationType, true),
      href: createFilterUrl('locationType', locationType),
    });
  }

  if (commitment) {
    tags.push({
      iconKey: 'commitment',
      label: titleCase(commitment),
      href: createFilterUrl('commitment', commitment),
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
      href: createFilterUrl('classification', classification),
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

const dtoToFundingRounds = (
  fundingRounds: FundingRoundDto[],
): JobFundingRoundSchema[] => {
  return fundingRounds
    .filter((fr) => fr.roundName)
    .sort((a, b) => (b.date ?? 0) - (a.date ?? 0))
    .map((fr) => ({
      roundName: fr.roundName!,
      amount: fr.raisedAmount
        ? `$${formatNumber(fr.raisedAmount * 1_000_000)}`
        : null,
      date: fr.date ? shortTimestamp(fr.date) : null,
      href: createFilterUrl(
        'fundingRounds',
        fr.roundName!.toLowerCase().replace(/\s+/g, '-'),
      ),
    }));
};

const dtoToInvestors = (investors: InvestorDto[]): JobInvestorSchema[] => {
  return investors.map((inv) => ({
    name: inv.name,
    href: createFilterUrl('investors', inv.normalizedName),
  }));
};

const dtoToJobItemOrg = (
  dto: JobListItemDto['organization'],
): JobOrganizationSchema | null => {
  if (!dto) return null;

  const {
    name,
    website,
    location,
    logoUrl,
    headcountEstimate,
    fundingRounds,
    investors,
  } = dto;

  return {
    name,
    href: createFilterUrl(
      'organizations',
      name.toLowerCase().replace(/\s+/g, '-'),
    ),
    websiteUrl: website,
    location,
    logo: getLogoUrl(website, logoUrl),
    employeeCount: headcountEstimate ? `${headcountEstimate}` : null,
    fundingRounds: dtoToFundingRounds(fundingRounds),
    investors: dtoToInvestors(investors),
  };
};

const dtoToJobItemBadge = (dto: JobListItemDto): JobListItemSchema['badge'] => {
  const { featured, access, onboardIntoWeb3 } = dto;

  if (featured) return JOB_ITEM_BADGE.FEATURED;
  if (access === 'protected') return JOB_ITEM_BADGE.EXPERT;
  if (onboardIntoWeb3) return JOB_ITEM_BADGE.BEGINNER;

  return null;
};
