import { buildUrlsetResponse } from '@/lib/server/sitemap/build-sitemap-xml';
import { clientEnv } from '@/lib/env/client';

export const dynamic = 'force-static';

export function GET() {
  return buildUrlsetResponse([{ loc: clientEnv.FRONTEND_URL }]);
}
