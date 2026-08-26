import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

describe('home mobile layout', () => {
  it('hides market analytics below the desktop breakpoint', () => {
    const layout = readFileSync(
      join(process.cwd(), 'src/app/(main)/(home)/layout.tsx'),
      'utf8',
    );

    expect(layout).toMatch(
      /<div className='hidden md:block'>\s*<Suspense fallback=\{<JobMarketOverviewSkeleton \/>\}>/,
    );
  });
});
