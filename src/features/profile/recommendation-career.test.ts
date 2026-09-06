import { describe, expect, it } from 'vitest';
import { recommendationCareerSchema } from './recommendation-career';

describe('recommendation career', () => {
  it('supports removal of all matching data', () => {
    expect(
      recommendationCareerSchema.parse({ roles: [], educationLevel: null }),
    ).toEqual({ roles: [], educationLevel: null });
  });
  it('requires unknown full dates to be null rather than partial strings', () => {
    expect(
      recommendationCareerSchema.safeParse({
        roles: [
          {
            title: 'Engineer',
            company: 'Acme',
            description: '',
            startDate: '2020',
            endDate: null,
            current: true,
            seniority: null,
          },
        ],
        educationLevel: null,
      }).success,
    ).toBe(false);
  });
});
