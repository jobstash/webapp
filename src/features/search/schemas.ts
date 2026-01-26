import { z } from 'zod';

export const suggestionItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});

export const suggestionGroupSchema = z.object({
  label: z.string(),
  items: z.array(suggestionItemSchema),
});

export const suggestionsResponseSchema = z.array(suggestionGroupSchema);

export type SuggestionItem = z.infer<typeof suggestionItemSchema>;
export type SuggestionGroup = z.infer<typeof suggestionGroupSchema>;
export type SuggestionsResponse = z.infer<typeof suggestionsResponseSchema>;
