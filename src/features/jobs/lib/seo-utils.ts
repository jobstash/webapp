import type { Address, MappedInfoTagSchema } from '@/lib/schemas';
import type { WorkArrangementV1 } from '@/features/jobs/work-arrangement';

interface SalaryData {
  currency: string;
  minValue: number;
  maxValue: number;
}

/** Extracts salary data from infoTags for Schema.org structured data */
export const extractSalaryData = (
  infoTags: MappedInfoTagSchema[],
): SalaryData | null => {
  const salaryTag = infoTags.find(
    (tag) => tag.iconKey === 'salary' || tag.iconKey.includes('money'),
  );

  if (!salaryTag) return null;

  // Parse "$80k - $120k" or "80k - 120k" format
  const kFormatMatch = salaryTag.label.match(
    /\$?(\d+(?:,\d{3})*(?:\.\d+)?)\s*k?\s*-\s*\$?(\d+(?:,\d{3})*(?:\.\d+)?)\s*k?/i,
  );
  if (kFormatMatch) {
    const rawMin = parseFloat(kFormatMatch[1].replace(/,/g, ''));
    const rawMax = parseFloat(kFormatMatch[2].replace(/,/g, ''));

    // If values are small (like 80, 120), they're likely in thousands
    const multiplier = rawMin < 1000 && rawMax < 1000 ? 1000 : 1;
    const minValue = rawMin * multiplier;
    const maxValue = rawMax * multiplier;

    // Extract currency from label or default to USD
    const currencyMatch = salaryTag.label.match(/([A-Z]{3})\s*$/);
    const currency = currencyMatch?.[1] ?? 'USD';

    return { currency, minValue, maxValue };
  }

  // Parse "80,000 - 120,000 USD" format
  const fullFormatMatch = salaryTag.label.match(
    /(\d+(?:,\d{3})*)\s*-\s*(\d+(?:,\d{3})*)\s*([A-Z]{3})?/,
  );
  if (fullFormatMatch) {
    const minValue = parseFloat(fullFormatMatch[1].replace(/,/g, ''));
    const maxValue = parseFloat(fullFormatMatch[2].replace(/,/g, ''));
    const currency = fullFormatMatch[3] ?? 'USD';

    return { currency, minValue, maxValue };
  }

  return null;
};

type SchemaEmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACTOR'
  | 'INTERN'
  | 'TEMPORARY';

/** Extracts employment type from infoTags for Schema.org structured data */
export const extractEmploymentType = (
  infoTags: MappedInfoTagSchema[],
): SchemaEmploymentType => {
  const commitmentTag = infoTags.find(
    (tag) => tag.iconKey === 'commitment' || tag.iconKey.includes('clock'),
  );

  if (!commitmentTag) return 'FULL_TIME';

  const label = commitmentTag.label.toLowerCase();

  if (label.includes('full')) return 'FULL_TIME';
  if (label.includes('part')) return 'PART_TIME';
  if (label.includes('contract')) return 'CONTRACTOR';
  if (label.includes('freelance')) return 'CONTRACTOR';
  if (label.includes('intern')) return 'INTERN';

  return 'FULL_TIME';
};

/**
 * Schema.org jobLocationType value.
 * Only 'TELECOMMUTE' is a valid Schema.org value for fully remote jobs.
 * Returns null for on-site only positions (no jobLocationType needed).
 */
type SchemaJobLocationType = 'TELECOMMUTE' | null;

const isEmployerBackedRemoteOption = (
  option: WorkArrangementV1['remoteOptions'][number],
): boolean =>
  option.mode === 'remote' &&
  option.classification === 'verified_remote' &&
  option.confidence !== 'inherited';

/**
 * Extracts job location type for Schema.org structured data.
 * Returns 'TELECOMMUTE' for fully remote positions, null for hybrid/on-site.
 * Google explicitly says not to mark hybrid or occasional work-from-home jobs
 * as TELECOMMUTE.
 */
export const extractJobLocationType = (
  infoTags: MappedInfoTagSchema[],
  addresses?: Address[] | null,
  sourceLocationType?: string | null,
  workArrangement?: WorkArrangementV1 | null,
): SchemaJobLocationType => {
  // Legacy labels, addresses, and aggregator fields are claims rather than
  // proof. TELECOMMUTE is emitted only from a validated employer-backed
  // WorkArrangementV1 option.
  void infoTags;
  void addresses;
  void sourceLocationType;
  if (
    workArrangement?.classification !== 'verified_remote' ||
    workArrangement.fullyRemote !== true
  ) {
    return null;
  }
  if (workArrangement.remoteOptions.some(isEmployerBackedRemoteOption)) {
    return 'TELECOMMUTE';
  }
  return null;
};

interface SchemaCountry {
  '@type': 'Country';
  name: string;
}

/**
 * Extracts applicant location requirements for remote jobs.
 * Returns countries where remote work is offered for Schema.org structured data.
 * Only relevant when jobLocationType is 'TELECOMMUTE'.
 *
 * Google requires applicantLocationRequirements for all TELECOMMUTE jobs.
 * Returns null when no valid country data is available — callers should
 * skip jobLocationType entirely in that case to avoid invalid structured data.
 */
export const extractApplicantLocationRequirements = (
  workArrangement?: WorkArrangementV1 | null,
): SchemaCountry[] | null => {
  if (workArrangement?.classification !== 'verified_remote') return null;

  const remoteCountries = workArrangement.remoteOptions
    .filter(isEmployerBackedRemoteOption)
    .flatMap((option) =>
      option.includedCountries.filter(
        (country) => !option.excludedCountries.includes(country),
      ),
    );

  if (remoteCountries.length === 0) return null;

  const uniqueCountries = [...new Set(remoteCountries)];

  return uniqueCountries.map((country) => ({
    '@type': 'Country',
    name: country,
  }));
};
