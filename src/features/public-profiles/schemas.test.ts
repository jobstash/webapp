import { describe, expect, it } from 'vitest';

import { publicProfileFixture } from './test-fixtures';
import {
  publicProfileAppealInputSchema,
  publicProfileResponseSchema,
  publicProfileReviewInputSchema,
  publicRecruiterCaseInputSchema,
} from './schemas';

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

  it('rejects the non-canonical descriptionShort field', () => {
    expect(
      publicProfileResponseSchema.safeParse({
        ...publicProfileFixture,
        data: {
          ...publicProfileFixture.data,
          info: {
            ...publicProfileFixture.data.info,
            descriptionShort: 'This field is not part of ProfileInfo.',
          },
        },
      }).success,
    ).toBe(false);
  });

  it('accepts an exact organization review and a private recruiter report', () => {
    expect(
      publicProfileReviewInputSchema.safeParse({
        childId: 'organization-1',
        rating: 4,
        reviewText: 'Clear process and accurate role description.',
      }).success,
    ).toBe(true);
    expect(
      publicRecruiterCaseInputSchema.safeParse({
        childId: 'organization-1',
        allegation: {
          category: 'phishing',
          recruiterContact: null,
          evidenceUrl: null,
          details: 'The recruiter requested account credentials.',
        },
      }).success,
    ).toBe(true);
  });

  it('requires a substantive warning appeal', () => {
    expect(
      publicProfileAppealInputSchema.safeParse({ appealText: 'No.' }).success,
    ).toBe(false);
  });
});
