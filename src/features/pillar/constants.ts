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

export const PILLAR_CATEGORY_CONFIG: Record<
  PillarCategory,
  {
    label: string;
    tagline: string;
    accent: string;
    accentMuted: string;
    dot: string;
  }
> = {
  tag: {
    label: 'Skill',
    tagline: 'Jobs', // Rendered as "{name} Jobs"
    accent: 'text-emerald-400',
    accentMuted: 'text-emerald-400/60',
    dot: 'bg-emerald-400',
  },
  classification: {
    label: 'Role',
    tagline: 'Jobs', // Rendered as "{name} Jobs"
    accent: 'text-blue-400',
    accentMuted: 'text-blue-400/60',
    dot: 'bg-blue-400',
  },
  location: {
    label: 'Location',
    tagline: 'Jobs in',
    accent: 'text-amber-400',
    accentMuted: 'text-amber-400/60',
    dot: 'bg-amber-400',
  },
  commitment: {
    label: 'Work Type',
    tagline: 'Jobs', // Rendered as "{name} Jobs"
    accent: 'text-violet-400',
    accentMuted: 'text-violet-400/60',
    dot: 'bg-violet-400',
  },
  locationType: {
    label: 'Work Mode',
    tagline: 'Jobs', // Rendered as "{name} Jobs"
    accent: 'text-cyan-400',
    accentMuted: 'text-cyan-400/60',
    dot: 'bg-cyan-400',
  },
  organization: {
    label: 'Company',
    tagline: 'Jobs at',
    accent: 'text-rose-400',
    accentMuted: 'text-rose-400/60',
    dot: 'bg-rose-400',
  },
  seniority: {
    label: 'Level',
    tagline: 'Explore',
    accent: 'text-orange-400',
    accentMuted: 'text-orange-400/60',
    dot: 'bg-orange-400',
  },
  investor: {
    label: 'Investor',
    tagline: 'Jobs backed by',
    accent: 'text-teal-400',
    accentMuted: 'text-teal-400/60',
    dot: 'bg-teal-400',
  },
  fundingRound: {
    label: 'Funding',
    tagline: 'Jobs at',
    accent: 'text-indigo-400',
    accentMuted: 'text-indigo-400/60',
    dot: 'bg-indigo-400',
  },
  boolean: {
    label: 'Filter',
    tagline: '', // Dynamic based on filter name
    accent: 'text-slate-400',
    accentMuted: 'text-slate-400/60',
    dot: 'bg-slate-400',
  },
};

// Custom display names for known slugs (key = slug without prefix)
const PILLAR_NAME_OVERRIDES: Record<string, string> = {
  // Classifications
  bizdev: 'Business Development',
  devrel: 'Developer Relations',
  // Commitments
  'full-time': 'Full-Time',
  'part-time': 'Part-Time',
  // Location types
  onsite: 'On-Site',
};

const PREFIX_TO_CATEGORY: [string, PillarCategory][] = [
  ['cl-', 'classification'],
  ['co-', 'commitment'],
  ['lt-', 'locationType'],
  ['fr-', 'fundingRound'],
  ['t-', 'tag'],
  ['l-', 'location'],
  ['o-', 'organization'],
  ['s-', 'seniority'],
  ['i-', 'investor'],
  ['b-', 'boolean'],
];

export const getPillarCategory = (slug: string): PillarCategory => {
  const match = PREFIX_TO_CATEGORY.find(([prefix]) => slug.startsWith(prefix));
  return match?.[1] ?? 'tag';
};

const ALL_PREFIXES = PREFIX_TO_CATEGORY.map(([prefix]) => prefix);
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
