import { z } from 'zod';

import { nonEmptyStringSchema } from '@/lib/schemas';

export const profileSkillSchema = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
});
export type ProfileSkill = z.infer<typeof profileSkillSchema>;

export const profileSkillsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: profileSkillSchema.array(),
});

export const showcaseItemSchema = z.object({
  label: nonEmptyStringSchema,
  url: nonEmptyStringSchema,
});
export type ShowcaseItem = z.infer<typeof showcaseItemSchema>;

export const profileShowcaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: showcaseItemSchema.array(),
});

export const linkedAccountSchema = z.object({
  type: z.enum(['google_oauth']),
  email: z.string().nullable(),
});
export type LinkedAccount = z.infer<typeof linkedAccountSchema>;

export const linkedAccountsResponseSchema = z.object({
  data: linkedAccountSchema.array(),
});
