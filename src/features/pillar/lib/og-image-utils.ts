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

const MAX_ORGS = 5;
const LONG_NAMES_THRESHOLD = 55;

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

  for (const job of jobs) {
    if (!job.organization) continue;
    const { name, logo } = job.organization;
    if (seen.has(name)) continue;
    seen.add(name);

    if (orgs.length < MAX_ORGS) {
      orgs.push({ name, logo });
    }
  }

  const totalChars = orgs.reduce((sum, org) => sum + org.name.length, 0);
  const finalOrgs = totalChars > LONG_NAMES_THRESHOLD ? orgs.slice(0, 4) : orgs;

  return { orgs: finalOrgs, overflowCount: seen.size - finalOrgs.length };
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
