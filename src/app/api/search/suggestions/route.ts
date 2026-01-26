import { suggestionsResponseSchema } from '@/features/search/schemas';
import { filterMockSuggestions } from '@/features/search/server/mock-data';
import { suggestionsRequestSchema } from '@/features/search/server/schemas';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { q } = suggestionsRequestSchema.parse({
    q: searchParams.get('q') ?? '',
  });

  const filtered = filterMockSuggestions(q);
  const validated = suggestionsResponseSchema.parse(filtered);

  return Response.json(validated);
}
