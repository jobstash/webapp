import { z } from 'zod';
import { jobPreferencesSchema, workModeSchema } from './job-preferences';
import {
  recommendationCareerSchema,
  type RecommendationCareer,
} from './recommendation-career';

// Extraction uses null/empty arrays for unknown fields; saved preferences stay authoritative.
export const resumePreferencesSchema = z.object({
  ...jobPreferencesSchema.shape,
  workModes: z.array(workModeSchema).min(1).nullable(),
  // OpenAI's strict output schema does not support JSON Schema's URI format.
  // URLs are still validated by the save schema below.
  showcaseRepositories: z.array(z.string()).max(20),
});

export const resumeCareerUpdateSchema = recommendationCareerSchema.extend({
  profile: z
    .object({
      name: z.string().max(160).nullable(),
      location: z
        .object({
          city: z.string().max(160).nullable(),
          country: z.string().max(160).nullable(),
          countryCode: z
            .string()
            .regex(/^[A-Z]{2}$/)
            .nullable(),
        })
        .nullable(),
    })
    .optional(),
  preferences: z.object(jobPreferencesSchema.shape).partial().optional(),
});
export type ResumeCareerUpdate = z.infer<typeof resumeCareerUpdateSchema>;

export const supportedResumeDates = (
  career: RecommendationCareer,
  text: string,
): RecommendationCareer => {
  const fullDates =
    text.match(
      /\b\d{4}-\d{2}-\d{2}\b|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b|\b\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b/gi,
    ) ?? [];
  const supported = new Set(
    fullDates.flatMap((value) => {
      const parsed = Date.parse(value.includes('-') ? value : `${value} UTC`);
      return Number.isFinite(parsed)
        ? [new Date(parsed).toISOString().slice(0, 10)]
        : [];
    }),
  );
  return {
    ...career,
    roles: career.roles.map((role) => ({
      ...role,
      startDate:
        role.startDate && supported.has(role.startDate) ? role.startDate : null,
      endDate:
        role.endDate && supported.has(role.endDate) ? role.endDate : null,
    })),
  };
};

export const resumeProfileDefaults = (
  extraction: {
    name: string | null;
    location: {
      city: string | null;
      country: string | null;
      countryCode: string | null;
    } | null;
    roleCategory: string;
    career: RecommendationCareer;
    preferences: z.infer<typeof resumePreferencesSchema>;
  },
  skills: { name: string }[],
): ResumeCareerUpdate => {
  const current = extraction.career.roles.filter((role) => role.current);
  const defaults = {
    ...extraction.preferences,
    residenceCountry:
      extraction.preferences.residenceCountry ??
      extraction.location?.countryCode?.toUpperCase() ??
      null,
    educationLevel:
      extraction.preferences.educationLevel ?? extraction.career.educationLevel,
    rolePriorities: extraction.preferences.rolePriorities.length
      ? extraction.preferences.rolePriorities
      : (current.length
          ? current.map((role) => role.title)
          : [extraction.roleCategory]
        ).filter(Boolean),
    seniorityLevels: extraction.preferences.seniorityLevels.length
      ? extraction.preferences.seniorityLevels
      : [
          ...new Set(
            current.flatMap((role) => (role.seniority ? [role.seniority] : [])),
          ),
        ],
    preferredSkills: extraction.preferences.preferredSkills.length
      ? extraction.preferences.preferredSkills
      : skills.map((skill) => skill.name),
  };
  return resumeCareerUpdateSchema.parse({
    ...extraction.career,
    profile: {
      name: extraction.name,
      location: extraction.location
        ? {
            city: extraction.location.city,
            country: extraction.location.country,
            countryCode: extraction.location.countryCode?.toUpperCase() ?? null,
          }
        : null,
    },
    preferences: Object.fromEntries(
      Object.entries(defaults).filter(
        ([, value]) =>
          value !== null && (!Array.isArray(value) || value.length),
      ),
    ),
  });
};
