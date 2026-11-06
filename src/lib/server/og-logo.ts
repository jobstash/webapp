import 'server-only';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Embed the trusted local asset without fetching the deployment's own origin.
export const jobstashLogoDataUrl = `data:image/png;base64,${readFileSync(
  join(process.cwd(), 'public/jobstash-logo.png'),
).toString('base64')}`;
