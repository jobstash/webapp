import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = (relativePath: string) =>
  readFileSync(join(process.cwd(), relativePath), 'utf8');

describe('mobile filter trigger placement', () => {
  it('passes the trigger into the home job-list toolbar and its loading state', () => {
    const homePage = source('src/app/(main)/(home)/page.tsx');

    expect(homePage).toContain(
      'fallback={<JobListSkeleton mobileFilters={<FiltersDrawer />} />}',
    );
    expect(homePage).toContain('mobileFilters={<FiltersDrawer />}');
    expect(homePage).not.toContain("className='mb-4 lg:hidden'");
  });

  it('passes the pillar-aware trigger into the pillar job-list toolbar', () => {
    const pillarPage = source('src/app/(main)/[slug]/page.tsx');

    expect(pillarPage).toMatch(
      /mobileFilters=\{\s*<FiltersDrawer pillarMode pillarContext=\{pillarContext\} \/>\s*\}/,
    );
    expect(pillarPage).not.toContain("className='mb-4 lg:hidden'");
  });
});
