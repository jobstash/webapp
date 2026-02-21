export const SENIORITY_MAPPING = {
  '1': 'Intern',
  '2': 'Junior',
  '3': 'Senior',
  '4': 'Lead',
  '5': 'Head',
} as const;

export const SENIORITY_LABEL_TO_KEY: Record<string, string> =
  Object.fromEntries(
    Object.entries(SENIORITY_MAPPING).map(([key, label]) => [
      label.toLowerCase(),
      key,
    ]),
  );

export const MAX_MATCH_SKILLS = 30;

export const POST_JOB_URL = 'https://form.typeform.com/to/O44vKstu';
