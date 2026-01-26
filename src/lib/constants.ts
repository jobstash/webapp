export const SENIORITY_MAPPING = {
  '1': 'Intern',
  '2': 'Junior',
  '3': 'Senior',
  '4': 'Lead',
  '5': 'Head',
} as const;

// Reverse mapping: label (lowercase) → numeric key
// Used by pillar pages to convert slug values (e.g., "senior") to API keys (e.g., "3")
export const SENIORITY_LABEL_TO_KEY: Record<string, string> =
  Object.fromEntries(
    Object.entries(SENIORITY_MAPPING).map(([key, label]) => [
      label.toLowerCase(),
      key,
    ]),
  );
