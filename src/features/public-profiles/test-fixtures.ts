export const publicProfileFixture = {
  success: true as const,
  message: 'Profile retrieved successfully',
  data: {
    id: 'profile-1',
    slug: 'example-labs',
    canonicalSlug: 'example-labs',
    category: 'Infrastructure',
    info: {
      displayName: 'Example Labs',
      summary: 'Public infrastructure for open networks.',
      description:
        'Example Labs builds and maintains public infrastructure for open networks.',
      logo: 'https://example.com/logo.png',
      canonicalSite: 'https://example.com',
      tagline: 'Infrastructure for everyone',
      foundingDate: '2020',
      profileType: ['Company'],
      profileSector: 'Infrastructure',
      profileStatus: 'Active',
    },
    children: [
      {
        id: 'org-1',
        type: 'organization' as const,
        name: 'Example Foundation',
        slug: 'example-foundation',
        logo: null,
        summary: 'Stewards the ecosystem.',
      },
    ],
    reviews: { count: 4, averageRating: 4.25 },
    salaries: {
      count: 2,
      byCurrency: [
        {
          currency: 'EUR',
          count: 2,
          average: 120_000,
          minimum: 100_000,
          maximum: 140_000,
        },
      ],
    },
    notices: [
      {
        id: 'notice-1',
        text: 'This is the decided and redacted public notice.',
        decidedAt: '2026-08-22T10:00:00.000Z',
      },
    ],
  },
};
