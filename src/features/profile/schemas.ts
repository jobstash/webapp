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
