import type { Address, MappedInfoTagSchema } from '@/lib/schemas';

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
 * Only 'TELECOMMUTE' is a valid Schema.org value for remote/hybrid jobs.
 * Returns null for on-site only positions (no jobLocationType needed).
 */
type SchemaJobLocationType = 'TELECOMMUTE' | null;

/**
 * Extracts job location type for Schema.org structured data.
 * Returns 'TELECOMMUTE' for remote/hybrid positions, null for on-site only.
 */
export const extractJobLocationType = (
  infoTags: MappedInfoTagSchema[],
  addresses?: Address[] | null,
): SchemaJobLocationType => {
  // Check addresses first - most reliable source
  if (addresses?.some((addr) => addr.isRemote)) {
    return 'TELECOMMUTE';
  }

  // Check workMode tag for remote/hybrid indicators
  const workModeTag = infoTags.find((tag) => tag.iconKey === 'workMode');
  if (workModeTag) {
    const label = workModeTag.label.toLowerCase();
    if (label.includes('remote') || label.includes('hybrid')) {
      return 'TELECOMMUTE';
    }
  }

  // Check location tag for explicit "Remote" label
  const locationTag = infoTags.find((tag) => tag.iconKey === 'location');
  if (locationTag?.label.toLowerCase() === 'remote') {
    return 'TELECOMMUTE';
  }

  // On-site positions don't need jobLocationType
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
 */
export const extractApplicantLocationRequirements = (
  addresses?: Address[] | null,
): SchemaCountry[] | null => {
  if (!addresses?.length) return null;

  const remoteCountries = addresses
    .filter((addr) => addr.isRemote)
    .map((addr) => addr.country);

  if (remoteCountries.length === 0) return null;

  const uniqueCountries = [...new Set(remoteCountries)];

  return uniqueCountries.map((country) => ({
    '@type': 'Country',
    name: country,
  }));
};
