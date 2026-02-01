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
