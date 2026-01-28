import { z } from 'zod';

export const suggestionItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});

export const suggestionGroupInfoSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const suggestionsResponseSchema = z.object({
  groups: z.array(suggestionGroupInfoSchema),
  activeGroup: z.string(),
  items: z.array(suggestionItemSchema),
  page: z.number(),
  hasMore: z.boolean(),
});

export type SuggestionItem = z.infer<typeof suggestionItemSchema>;
export type SuggestionGroupInfo = z.infer<typeof suggestionGroupInfoSchema>;
export type SuggestionsResponse = z.infer<typeof suggestionsResponseSchema>;
