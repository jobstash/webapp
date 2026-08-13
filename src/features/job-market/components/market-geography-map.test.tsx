// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { JobMarketCompensation } from '../schemas';
import { MarketGeographyMap } from './market-geography-map';

const geography: JobMarketCompensation[] = [
  {
    segment: 'local',
    regionSlug: 'europe',
    regionLabel: 'Europe',
    medianMonthlyUsd: 9_000,
    p25MonthlyUsd: 7_000,
    p75MonthlyUsd: 11_000,
    adjustedPremiumPercent: 2,
    sampleCount: 50,
    employerCount: 20,
    onsiteCount: 35,
    hybridCount: 15,
    remoteCount: 0,
    reliable: true,
  },
  {
    segment: 'local',
    regionSlug: 'africa',
    regionLabel: 'Africa',
    medianMonthlyUsd: null,
    p25MonthlyUsd: null,
    p75MonthlyUsd: null,
    adjustedPremiumPercent: null,
    sampleCount: 7,
    employerCount: 4,
    onsiteCount: 5,
    hybridCount: 2,
    remoteCount: 0,
    reliable: false,
  },
];

afterEach(cleanup);

describe('MarketGeographyMap', () => {
  it('publishes reliable regions and labels sparse evidence without inventing pay', () => {
    render(
      <MarketGeographyMap
        geography={geography}
        classification='cl-engineering'
      />,
    );

    expect(
      screen.getByRole('img', {
        name: /local monthly salaries by continent/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'Open Europe jobs' }).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('$9K/mo')).toBeInTheDocument();
    expect(screen.getByText('Africa')).toBeInTheDocument();
    expect(screen.getByText('Insufficient evidence')).toBeInTheDocument();
    expect(
      screen.getByText('Fixed $3K–$20K monthly scale'),
    ).toBeInTheDocument();
  });
});
