import { describe, expect, it } from 'vitest';

import { getPublicProfileMetadataDescription } from './metadata';
import { publicProfileFixture } from './test-fixtures';

describe('getPublicProfileMetadataDescription', () => {
  it('uses the short ProfileInfo summary before the long description', () => {
    expect(getPublicProfileMetadataDescription(publicProfileFixture.data)).toBe(
      publicProfileFixture.data.info.summary,
    );
  });

  it('falls back through description and tagline without conflating fields', () => {
    expect(
      getPublicProfileMetadataDescription({
        ...publicProfileFixture.data,
        info: { ...publicProfileFixture.data.info, summary: null },
      }),
    ).toBe(publicProfileFixture.data.info.description);
    expect(
      getPublicProfileMetadataDescription({
        ...publicProfileFixture.data,
        info: {
          ...publicProfileFixture.data.info,
          summary: null,
          description: null,
        },
      }),
    ).toBe(publicProfileFixture.data.info.tagline);
  });
});
