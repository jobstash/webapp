import { z } from 'zod';

import { optionalDataResponseSchema } from '@/lib/shared/core/schemas';

export const profileCheckResultSchema = z.object({
  showCvUpload: z.boolean(),
  showRequiredInfo: z.boolean(),
});

export type ProfileCheckResultSchema = z.infer<typeof profileCheckResultSchema>;

export const profileCheckResponseSchema = optionalDataResponseSchema(
  profileCheckResultSchema,
);
export type ProfileCheckResponseSchema = z.infer<typeof profileCheckResponseSchema>;

export const processCVResultSchema = optionalDataResponseSchema(profileCheckResultSchema);
export type ProcessCVResultSchema = z.infer<typeof processCVResultSchema>;

export const processCVResponseSchema = optionalDataResponseSchema(
  profileCheckResultSchema,
);
export type ProcessCVResponseSchema = z.infer<typeof processCVResponseSchema>;
