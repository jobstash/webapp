import { z } from 'zod';

export const recommendationCareerSchema = z.object({
  roles: z
    .array(
      z.object({
        title: z.string().max(160),
        company: z.string().max(160),
        description: z.string().max(2000),
        startDate: z.string().date().nullable(),
        endDate: z.string().date().nullable(),
        current: z.boolean(),
        seniority: z
          .enum([
            'intern',
            'junior',
            'mid',
            'senior',
            'lead',
            'principal',
            'executive',
          ])
          .nullable(),
      }),
    )
    .max(30),
  educationLevel: z
    .enum([
      'secondary',
      'associate',
      'bachelor',
      'master',
      'doctorate',
      'other',
    ])
    .nullable(),
});

export type RecommendationCareer = z.infer<typeof recommendationCareerSchema>;
