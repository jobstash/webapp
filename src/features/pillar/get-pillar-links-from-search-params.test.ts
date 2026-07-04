import { describe, expect, it } from 'vitest';

import { getPillarLinksFromSearchParams } from './constants';

describe('getPillarLinksFromSearchParams', () => {
  it('maps a tags CSV to tag pillar links', () => {
    expect(getPillarLinksFromSearchParams({ tags: 'react,solidity' })).toEqual([
      { label: 'React', href: '/t-react' },
      { label: 'Solidity', href: '/t-solidity' },
    ]);
  });

  it('maps numeric seniority to the label slug', () => {
    expect(getPillarLinksFromSearchParams({ seniority: '3' })).toEqual([
      { label: 'Senior', href: '/s-senior' },
    ]);
  });

  it('maps boolean params to alias pillar slugs', () => {
    expect(
      getPillarLinksFromSearchParams({
        expertJobs: 'true',
        onboardIntoWeb3: 'true',
        paysInCrypto: 'true',
      }),
    ).toEqual([
      { label: 'Urgently Hiring', href: '/urgently-hiring' },
      { label: 'Crypto Beginner Jobs', href: '/crypto-beginner-jobs' },
      { label: 'Pays In Crypto', href: '/b-pays-in-crypto' },
    ]);
  });

  it('ignores unknown params, false booleans, and unmapped seniority', () => {
    expect(
      getPillarLinksFromSearchParams({
        page: '3',
        query: 'react',
        expertJobs: 'false',
        seniority: '9',
      }),
    ).toEqual([]);
  });

  it('dedupes and caps the number of links', () => {
    const tags = Array.from({ length: 12 }, (_, i) => `tag-${i}`).join(',');
    const links = getPillarLinksFromSearchParams({
      tags: `react,react,${tags}`,
    });

    expect(links).toHaveLength(8);
    expect(links.filter((l) => l.href === '/t-react')).toHaveLength(1);
  });

  it('normalizes casing and whitespace in values', () => {
    expect(
      getPillarLinksFromSearchParams({ organizations: ' Bitrefill ' }),
    ).toEqual([{ label: 'Bitrefill', href: '/o-bitrefill' }]);
  });
});
