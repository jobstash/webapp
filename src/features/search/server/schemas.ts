import { z } from 'zod';

export const suggestionsRequestSchema = z.object({
  q: z.string().optional().default(''),
  group: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export type SuggestionsRequest = z.infer<typeof suggestionsRequestSchema>;
