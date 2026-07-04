import { SENIORITY_LABEL_TO_KEY, SENIORITY_MAPPING } from '@/lib/constants';

import type { PillarFilterContext, SuggestedPillar } from './schemas';

// Pillar pages with fewer jobs than this are thin/doorway content:
// they render normally for humans but are noindexed.
export const PILLAR_MIN_INDEXABLE_JOBS = 3;

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

// Custom slug aliases: frontend URL slug → MW API slug
const SLUG_TO_API: Record<string, string> = {
  'urgently-hiring': 'b-expertJobs',
  'crypto-beginner-jobs': 'b-onboardIntoWeb3',
};

// Reverse map: MW API slug → frontend URL slug
const API_TO_SLUG: Record<string, string> = {
  'b-expertJobs': 'urgently-hiring',
  'b-onboardIntoWeb3': 'crypto-beginner-jobs',
};

export const getApiSlug = (slug: string): string => SLUG_TO_API[slug] ?? slug;
export const getFrontendSlug = (slug: string): string =>
  API_TO_SLUG[slug] ?? slug;

export const isValidPillarSlug = (slug: string): boolean =>
  slug in SLUG_TO_API ||
  PREFIX_MAPPINGS.some(({ prefix }) => slug.startsWith(prefix));

const BOOLEAN_SLUG_TO_PARAM_KEY: Record<string, string> = {
  'offers-token-allocation': 'offersTokenAllocation',
  'beginner-friendly': 'onboardIntoWeb3',
  'pays-in-crypto': 'paysInCrypto',
};

const findMapping = (slug: string): PrefixMapping | undefined =>
  PREFIX_MAPPINGS.find(({ prefix }) => slug.startsWith(prefix));

export const getPillarCategory = (slug: string): PillarCategory =>
  slug in SLUG_TO_API ? 'boolean' : (findMapping(slug)?.category ?? 'tag');

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
  'urgently-hiring': 'Urgently Hiring Jobs',
  'crypto-beginner-jobs': 'Crypto Beginner Jobs',
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
  if (slug in SLUG_TO_API) {
    const paramKey = SLUG_TO_API[slug].slice(2); // strip 'b-' prefix
    return { paramKey, value: 'true' };
  }

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

// Boolean filter params → their pillar page (alias slugs preferred for SEO)
const BOOLEAN_PARAM_KEY_TO_SLUG: Record<string, string> = {
  expertJobs: 'urgently-hiring',
  onboardIntoWeb3: 'crypto-beginner-jobs',
  paysInCrypto: 'b-pays-in-crypto',
  offersTokenAllocation: 'b-offers-token-allocation',
};

const MAX_PILLAR_LINKS = 8;

/**
 * Reverse-maps active filter params to their pillar pages so filtered views
 * can cross-link to the SEO landing pages (e.g. `?tags=react` → `/t-react`).
 * Location has no filter param and is correctly skipped.
 */
export const getPillarLinksFromSearchParams = (
  searchParams: Record<string, string>,
): SuggestedPillar[] => {
  const slugs: string[] = [];

  for (const { prefix, paramKey } of PREFIX_MAPPINGS) {
    const paramValue = paramKey ? searchParams[paramKey] : undefined;
    if (!paramValue) continue;

    for (const value of paramValue.split(',')) {
      const trimmed = value.trim().toLowerCase();
      if (!trimmed) continue;

      if (paramKey === 'seniority') {
        const label = (SENIORITY_MAPPING as Record<string, string>)[trimmed];
        if (label) slugs.push(`s-${label.toLowerCase()}`);
        continue;
      }

      slugs.push(`${prefix}${trimmed}`);
    }
  }

  for (const [paramKey, slug] of Object.entries(BOOLEAN_PARAM_KEY_TO_SLUG)) {
    if (searchParams[paramKey] === 'true') slugs.push(slug);
  }

  return [...new Set(slugs)].slice(0, MAX_PILLAR_LINKS).map((slug) => ({
    label: getPillarName(slug),
    href: `/${slug}`,
  }));
};
