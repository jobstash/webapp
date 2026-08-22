import { describe, expect, it } from 'vitest';

import { publicProfileFixture } from './test-fixtures';
import { publicProfileResponseSchema } from './schemas';

describe('publicProfileResponseSchema', () => {
  it('accepts only the public aggregate contract', () => {
    expect(publicProfileResponseSchema.parse(publicProfileFixture)).toEqual(
      publicProfileFixture,
    );
  });

  it.each([
    ['contactEmail', 'private@example.com'],
    ['roster', [{ login: 'person' }]],
    ['pendingNotices', [{ text: 'unreviewed' }]],
  ])('rejects unexpected private field %s', (field, value) => {
    expect(
      publicProfileResponseSchema.safeParse({
        ...publicProfileFixture,
        data: { ...publicProfileFixture.data, [field]: value },
      }).success,
    ).toBe(false);
  });

  it('rejects non-HTTP public links', () => {
    expect(
      publicProfileResponseSchema.safeParse({
        ...publicProfileFixture,
        data: {
          ...publicProfileFixture.data,
          info: {
            ...publicProfileFixture.data.info,
            canonicalSite: 'javascript:alert(1)',
          },
        },
      }).success,
    ).toBe(false);
  });
});
