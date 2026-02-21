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

export const SKILL_WARNING_THRESHOLD = 10;
export const SKILL_ERROR_THRESHOLD = 15;

export type SkillStatus = 'ok' | 'warning' | 'error';

export const SKILL_STATUS_MESSAGE: Record<SkillStatus, string> = {
  ok: 'Search and add skills to your profile',
  warning: 'Your skills are too broad. Narrow it down for better matches',
  error: 'Too many skills. Remove some to continue.',
};

export const getSkillStatus = (count: number): SkillStatus => {
  if (count >= SKILL_ERROR_THRESHOLD) return 'error';
  if (count >= SKILL_WARNING_THRESHOLD) return 'warning';
  return 'ok';
};

export const POST_JOB_URL = 'https://form.typeform.com/to/O44vKstu';
