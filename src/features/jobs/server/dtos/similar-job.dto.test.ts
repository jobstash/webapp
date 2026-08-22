import { describe, expect, it } from 'vitest';

import { dtoToSimilarJob } from './dto-to-job-details';
import { similarJobItemDto } from './similar-job.dto';

describe('similarJobItemDto', () => {
  it('maps a direct Project employer into the similar-job card', () => {
    const dto = similarJobItemDto.parse({
      shortUUID: 'project-job',
      title: 'Protocol Engineer',
      timestamp: Date.UTC(2026, 7, 22),
      organization: null,
      project: {
        name: 'Uniswap',
        normalizedName: 'uniswap',
        logo: 'https://uniswap.org/logo.png',
        website: 'https://uniswap.org',
      },
    });

    expect(dtoToSimilarJob(dto)).toMatchObject({
      id: 'project-job-uniswap',
      href: '/protocol-engineer-uniswap/project-job',
      companyName: 'Uniswap',
      companyLogo: 'https://uniswap.org/logo.png',
    });
  });

  it.each([
    [{ organization: null, project: null }],
    [
      {
        organization: {
          name: 'Acme',
          normalizedName: 'acme',
          logoUrl: null,
          website: null,
        },
        project: {
          name: 'Acme Project',
          normalizedName: 'acme-project',
          logo: null,
          website: null,
        },
      },
    ],
  ])('rejects a non-XOR employer payload', (employers) => {
    expect(
      similarJobItemDto.safeParse({
        shortUUID: 'job',
        title: 'Engineer',
        timestamp: 1,
        ...employers,
      }).success,
    ).toBe(false);
  });
});
