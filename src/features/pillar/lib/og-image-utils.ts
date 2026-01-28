import type { PillarCategory } from '@/features/pillar/constants';
import {
  getBooleanTagline,
  getPillarCategory,
  getPillarName,
  PILLAR_CATEGORY_CONFIG,
} from '@/features/pillar/constants';
import type { PillarPageStatic } from '@/features/pillar/schemas';
import type { JobListItemSchema } from '@/features/jobs/schemas';

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

const CATEGORY_ACCENT_HEX: Record<PillarCategory, string> = {
  tag: '#34D399',
  classification: '#60A5FA',
  location: '#FBBF24',
  commitment: '#A78BFA',
  locationType: '#22D3EE',
  organization: '#FB7185',
  seniority: '#FB923C',
  investor: '#2DD4BF',
  fundingRound: '#818CF8',
  boolean: '#94A3B8',
};

interface OrgInfo {
  name: string;
  logo: string | null;
}

// Character threshold for org names to fit on single line
// Based on: 1200px width - 112px padding = 1088px available
// Each org: 60px (logo+gap) + ~15px per char + 32px gap between items
const MAX_ORG_CHARS = 40;

interface HeadlineParts {
  text: string;
  coloredText: string | null;
  nameFirst: boolean;
}

type CategoryConfig = (typeof PILLAR_CATEGORY_CONFIG)[PillarCategory];

const getHeadlineParts = (
  slug: string,
  category: PillarCategory,
  config: CategoryConfig,
): HeadlineParts => {
  if (category === 'boolean') {
    return {
      text: getBooleanTagline(slug),
      coloredText: null,
      nameFirst: false,
    };
  }
  return {
    text: config.tagline,
    coloredText: getPillarName(slug),
    nameFirst: config.nameFirst,
  };
};

const extractOrgData = (jobs: JobListItemSchema[]) => {
  const seen = new Set<string>();
  const orgs: OrgInfo[] = [];
  let totalChars = 0;

  for (const job of jobs) {
    if (!job.organization) continue;
    const { name, logo } = job.organization;
    if (seen.has(name)) continue;
    seen.add(name);

    // Only add org if total character count stays within threshold
    if (totalChars + name.length <= MAX_ORG_CHARS) {
      orgs.push({ name, logo });
      totalChars += name.length;
    }
  }

  return { orgs, overflowCount: seen.size - orgs.length };
};

export const extractPillarOgImageData = (
  pillarData: PillarPageStatic,
  slug: string,
) => {
  const category = getPillarCategory(slug);
  const config = PILLAR_CATEGORY_CONFIG[category];
  const { orgs, overflowCount } = extractOrgData(pillarData.jobs);
  const jobCount = pillarData.jobs.length;
  const jobCountLabel = jobCount >= 20 ? '20+' : String(jobCount);
  const accentColor = CATEGORY_ACCENT_HEX[category];

  const headlineParts = getHeadlineParts(slug, category, config);

  return {
    headlineParts,
    jobCountLabel,
    description: pillarData.description,
    categoryLabel: config.label,
    accentColor,
    orgs,
    overflowCount,
  };
};
