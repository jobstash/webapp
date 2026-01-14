import { z } from 'zod';

export const suggestionsRequestSchema = z.object({
  q: z.string().optional().default(''),
});

export type SuggestionsRequest = z.infer<typeof suggestionsRequestSchema>;
