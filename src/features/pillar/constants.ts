import { SENIORITY_LABEL_TO_KEY } from '@/lib/constants';

import type { PillarFilterContext } from './schemas';

export type PillarCategory =
  | 'tag'
  | 'classification'
  | 'location'
  | 'commitment'
  | 'locationType'
  | 'organization'
  | 'seniority'
  | 'investor'
  | 'fundingRound'
  | 'boolean';

interface CategoryConfig {
  label: string;
  tagline: string;
  accent: string;
  dot: string;
  nameFirst: boolean;
}

export const PILLAR_CATEGORY_CONFIG: Record<PillarCategory, CategoryConfig> = {
  tag: {
    label: 'Skill',
    tagline: 'Jobs',
    accent: 'text-emerald-400',
    dot: 'bg-emerald-400',
    nameFirst: true,
  },
  classification: {
    label: 'Role',
    tagline: 'Jobs',
    accent: 'text-blue-400',
    dot: 'bg-blue-400',
    nameFirst: true,
  },
  location: {
    label: 'Location',
    tagline: 'Jobs in',
    accent: 'text-amber-400',
    dot: 'bg-amber-400',
    nameFirst: false,
  },
  commitment: {
    label: 'Work Type',
    tagline: 'Jobs',
    accent: 'text-violet-400',
    dot: 'bg-violet-400',
    nameFirst: true,
  },
  locationType: {
    label: 'Work Mode',
    tagline: 'Jobs',
    accent: 'text-cyan-400',
    dot: 'bg-cyan-400',
    nameFirst: true,
  },
  organization: {
    label: 'Company',
    tagline: 'Jobs at',
    accent: 'text-rose-400',
    dot: 'bg-rose-400',
    nameFirst: false,
  },
  seniority: {
    label: 'Level',
    tagline: 'Role Jobs',
    accent: 'text-orange-400',
    dot: 'bg-orange-400',
    nameFirst: true,
  },
  investor: {
    label: 'Investor',
    tagline: 'Jobs backed by',
    accent: 'text-teal-400',
    dot: 'bg-teal-400',
    nameFirst: false,
  },
  fundingRound: {
    label: 'Funding',
    tagline: 'Funded Jobs',
    accent: 'text-indigo-400',
    dot: 'bg-indigo-400',
    nameFirst: true,
  },
  boolean: {
    label: 'Filter',
    tagline: '',
    accent: 'text-slate-400',
    dot: 'bg-slate-400',
    nameFirst: false,
  },
};

const PILLAR_NAME_OVERRIDES: Record<string, string> = {
  bizdev: 'Business Development',
  devrel: 'Developer Relations',
  'full-time': 'Full-Time',
  'part-time': 'Part-Time',
  onsite: 'On-Site',
};

interface PrefixMapping {
  prefix: string;
  category: PillarCategory;
  paramKey: string | null;
}

const PREFIX_MAPPINGS: PrefixMapping[] = [
  { prefix: 'cl-', category: 'classification', paramKey: 'classifications' },
  { prefix: 'co-', category: 'commitment', paramKey: 'commitments' },
  { prefix: 'lt-', category: 'locationType', paramKey: 'locations' },
  { prefix: 'fr-', category: 'fundingRound', paramKey: 'fundingRounds' },
  { prefix: 't-', category: 'tag', paramKey: 'tags' },
  { prefix: 'l-', category: 'location', paramKey: null },
  { prefix: 'o-', category: 'organization', paramKey: 'organizations' },
  { prefix: 's-', category: 'seniority', paramKey: 'seniority' },
  { prefix: 'i-', category: 'investor', paramKey: 'investors' },
  { prefix: 'b-', category: 'boolean', paramKey: null },
];

export const isValidPillarSlug = (slug: string): boolean =>
  PREFIX_MAPPINGS.some(({ prefix }) => slug.startsWith(prefix));

const BOOLEAN_SLUG_TO_PARAM_KEY: Record<string, string> = {
  'offers-token-allocation': 'offersTokenAllocation',
  'beginner-friendly': 'onboardIntoWeb3',
  expert: 'expertJobs',
  'pays-in-crypto': 'paysInCrypto',
};

const findMapping = (slug: string): PrefixMapping | undefined =>
  PREFIX_MAPPINGS.find(({ prefix }) => slug.startsWith(prefix));

export const getPillarCategory = (slug: string): PillarCategory =>
  findMapping(slug)?.category ?? 'tag';

const ALL_PREFIXES = PREFIX_MAPPINGS.map(({ prefix }) => prefix);
const PREFIX_REGEX = new RegExp(`^(${ALL_PREFIXES.join('|')})`);

const toTitleCase = (str: string): string =>
  str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const getPillarName = (slug: string): string => {
  const withoutPrefix = slug.replace(PREFIX_REGEX, '');
  return PILLAR_NAME_OVERRIDES[withoutPrefix] ?? toTitleCase(withoutPrefix);
};

const BOOLEAN_TAGLINES: Record<string, string> = {
  'pays-in-crypto': 'Jobs that pay in crypto',
  'offers-token-allocation': 'Jobs with token allocation',
};

export const getBooleanTagline = (slug: string): string => {
  const filterName = slug.replace(/^b-/, '');
  return BOOLEAN_TAGLINES[filterName] ?? `Jobs with ${getPillarName(slug)}`;
};

export const getPillarHeadline = (slug: string): string => {
  const category = getPillarCategory(slug);

  if (category === 'boolean') {
    return getBooleanTagline(slug);
  }

  const config = PILLAR_CATEGORY_CONFIG[category];
  const pillarName = getPillarName(slug);

  return config.nameFirst
    ? `${pillarName} ${config.tagline}`
    : `${config.tagline} ${pillarName}`;
};

export const getPillarFilterContext = (
  slug: string,
): PillarFilterContext | null => {
  if (slug.startsWith('b-')) {
    const booleanSlug = slug.slice(2);
    const paramKey = BOOLEAN_SLUG_TO_PARAM_KEY[booleanSlug];
    return paramKey ? { paramKey, value: 'true' } : null;
  }

  const mapping = findMapping(slug);
  if (!mapping?.paramKey) return null;

  const value = slug.slice(mapping.prefix.length);
  if (!value) return null;

  // Seniority requires numeric key (e.g., "3" for "Senior")
  if (mapping.paramKey === 'seniority') {
    const numericValue = SENIORITY_LABEL_TO_KEY[value];
    return numericValue ? { paramKey: 'seniority', value: numericValue } : null;
  }

  return { paramKey: mapping.paramKey, value };
};

export const getPillarFilterHref = (
  pillarContext: PillarFilterContext | null,
): string => {
  if (!pillarContext) return '/';
  return `/?${pillarContext.paramKey}=${encodeURIComponent(pillarContext.value)}`;
};
