import type { Address, MappedInfoTagSchema } from '@/lib/schemas';

/**
 * Salary data extracted from infoTags for structured data
 */
interface SalaryData {
  currency: string;
  minValue: number;
  maxValue: number;
}

/**
 * Extracts salary data from infoTags for Schema.org structured data
 * @returns Salary object or null if no salary info found
 */
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

/**
 * Schema.org employment type values
 */
type SchemaEmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACTOR'
  | 'INTERN'
  | 'TEMPORARY';

/**
 * Extracts employment type from infoTags for Schema.org structured data
 * @returns Schema.org employment type string
 */
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
 * Job location type for structured data
 */
type JobLocationType = 'TELECOMMUTE' | 'onsite' | null;

/**
 * Extracts job location type from addresses or infoTags for structured data
 * @returns Location type or null if not determinable
 */
export const extractLocationType = (
  infoTags: MappedInfoTagSchema[],
  addresses?: Address[] | null,
): JobLocationType => {
  // Check addresses for isRemote first (most accurate)
  if (addresses?.some((addr) => addr.isRemote)) {
    return 'TELECOMMUTE';
  }

  // Check workMode tag (more specific than location tag)
  const workModeTag = infoTags.find((tag) => tag.iconKey === 'workMode');
  if (workModeTag) {
    const label = workModeTag.label.toLowerCase();
    if (label.includes('remote')) return 'TELECOMMUTE';
    if (label.includes('on-site') || label.includes('onsite')) return 'onsite';
    if (label.includes('hybrid')) return 'TELECOMMUTE';
  }

  // Check location tag as fallback
  const locationTag = infoTags.find((tag) => tag.iconKey === 'location');
  if (locationTag) {
    const label = locationTag.label.toLowerCase();
    if (label === 'remote') return 'TELECOMMUTE';
  }

  return null;
};
