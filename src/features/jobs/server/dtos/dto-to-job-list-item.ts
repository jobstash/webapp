import 'server-only';

import { capitalize, getTagColorIndex } from '@/lib/utils';
import {
  lookupAddresses,
  type AddressLookupResult,
} from '@/lib/server/address-lookup';
import {
  formatNumber,
  getLogoUrl,
  prettyTimestamp,
  shortTimestamp,
  slugify,
  titleCase,
} from '@/lib/server/utils';
import {
  type JobListItemDto,
  type JobOrgProjectDto,
} from './job-list-item.dto';
import {
  type JobFundingRoundSchema,
  type JobInvestorSchema,
  type JobListItemSchema,
  type JobOrganizationSchema,
} from '@/features/jobs/schemas';
import type { MappedInfoTagSchema } from '@/lib/schemas';
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

const getDefaultSummary = (dto: JobListItemDto): string => {
  const orgName = dto.organization?.name;
  const title = dto.title ?? getDefaultTitle(dto);
  return orgName
    ? `${orgName} is looking for a ${title}.`
    : `Apply for ${title} position.`;
};

export const dtoToJobListItem = (dto: JobListItemDto): JobListItemSchema => {
  const {
    shortUUID,
    timestamp,
    summary,
    location,
    locationType,
    tags,
    organization,
  } = dto;

  const lookupKey =
    locationType?.toLowerCase() === 'remote' && location
      ? `[REMOTE] ${location}`
      : location;
  const addressLookup = lookupAddresses(lookupKey);
  const title = dto.title ?? getDefaultTitle(dto);
  const href = createJobItemHref(title, dto);
  const infoTags = createJobInfoTags(dto, addressLookup, timestamp);
  const mappedTags = dtoToJobItemTag(tags);
  const mappedOrg = dtoToJobItemOrg(organization);
  const badge = dtoToJobItemBadge(dto);
  const timestampText = prettyTimestamp(timestamp);
  const datePosted = new Date(timestamp).toISOString().split('T')[0];

  return {
    id: shortUUID,
    title,
    href,
    hasApplyUrl: !!dto.url,
    summary: summary || getDefaultSummary(dto),
    addresses: addressLookup?.addresses ?? null,
    infoTags,
    tags: mappedTags,
    organization: mappedOrg,
    badge,
    timestampText,
    datePosted,
  };
};

const createJobItemHref = (title: string, dto: JobListItemDto) => {
  const orgText = dto.organization?.name ? `-${dto.organization?.name}` : '';
  const slug = slugify(`${title}${orgText}`);
  return `/${slug}/${dto.shortUUID}`;
};

const createJobInfoTags = (
  dto: JobListItemDto,
  addressLookup: AddressLookupResult | null,
  timestamp: number,
) => {
  const {
    seniority,
    locationType,
    location,
    commitment,
    paysInCrypto,
    offersTokenAllocation,
    classification,
    organization,
  } = dto;

  const tags: MappedInfoTagSchema[] = [];

  tags.push({
    iconKey: 'posted',
    label: prettyTimestamp(timestamp),
    ...(dto.publishedTimestampIsVerified === true && { verified: true }),
  });

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
    const locationLabel = addressLookup?.label ?? capitalize(location);
    tags.push({
      iconKey: 'location',
      label: locationLabel,
      href: `/l-${slugify(location)}`,
    });
  }

  if (locationType) {
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

  if (organization) {
    tags.push({
      iconKey: 'externalLink',
      label: `Jobs by ${organization.name}`,
      href: `/o-${organization.normalizedName}`,
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

const dtoToJobItemTag = (
  dto: JobListItemDto['tags'],
): JobListItemSchema['tags'] => {
  return dto.map((tag) => ({
    id: tag.id,
    name: titleCase(tag.name),
    normalizedName: tag.normalizedName,
    colorIndex: getTagColorIndex(tag.id),
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

const normalizeSocialUrl = (
  value: string | null | undefined,
  buildUrl: (handle: string) => string,
): string | null => {
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return buildUrl(value.replace(/^@/, ''));
};

// Any org-shaped payload (job list/details org, pillar static org) —
// only `name` is guaranteed.
export interface OrgInfoSource {
  name: string;
  website?: string | null;
  location?: string | null;
  logoUrl?: string | null;
  headcountEstimate?: number | null;
  summary?: string | null;
  description?: string | null;
  discord?: string | null;
  telegram?: string | null;
  twitter?: string | null;
  github?: string | null;
  docs?: string | null;
  projects?: JobOrgProjectDto[];
  fundingRounds?: FundingRoundDto[];
  investors?: InvestorDto[];
}

const dtoToOrgSocials = (
  dto: OrgInfoSource,
): JobOrganizationSchema['socials'] => {
  const socials = {
    twitter: normalizeSocialUrl(dto.twitter, (h) => `https://x.com/${h}`),
    telegram: normalizeSocialUrl(dto.telegram, (h) => `https://t.me/${h}`),
    discord: normalizeSocialUrl(dto.discord, (h) => `https://discord.gg/${h}`),
    github: normalizeSocialUrl(dto.github, (h) => `https://github.com/${h}`),
    docs: dto.docs ?? null,
  };

  const hasAny = Object.values(socials).some(Boolean);
  return hasAny ? socials : null;
};

const dtoToOrgProjects = (
  dto: OrgInfoSource,
): JobOrganizationSchema['projects'] => {
  return (dto.projects ?? [])
    .filter((project) => !!project.name)
    .map((project) => ({
      id: project.id,
      name: project.name as string,
      logo: getLogoUrl(
        project.website ?? null,
        project.logoUrl ?? project.logo ?? null,
      ),
      website: project.website ?? null,
      category: project.category ?? null,
    }));
};

export const dtoToOrgInfo = (
  dto: OrgInfoSource,
  href: string,
): JobOrganizationSchema => ({
  name: dto.name,
  href,
  websiteUrl: dto.website ?? null,
  location: dto.location ?? null,
  logo: getLogoUrl(dto.website ?? null, dto.logoUrl ?? null),
  employeeCount: dto.headcountEstimate ? `${dto.headcountEstimate}` : null,
  summary: dto.summary ?? null,
  description: dto.description ?? null,
  socials: dtoToOrgSocials(dto),
  projects: dtoToOrgProjects(dto),
  fundingRounds: dtoToFundingRounds(dto.fundingRounds ?? []),
  investors: dtoToInvestors(dto.investors ?? []),
});

export const dtoToJobItemOrg = (
  dto: JobListItemDto['organization'],
): JobOrganizationSchema | null => {
  if (!dto) return null;
  return dtoToOrgInfo(dto, `/o-${dto.normalizedName}`);
};

const dtoToJobItemBadge = (dto: JobListItemDto): JobListItemSchema['badge'] => {
  const { featured, access, onboardIntoWeb3 } = dto;

  if (featured) return JOB_ITEM_BADGE.FEATURED;
  if (access === 'protected') return JOB_ITEM_BADGE.URGENTLY_HIRING;
  if (onboardIntoWeb3) return JOB_ITEM_BADGE.BEGINNER;

  return null;
};
