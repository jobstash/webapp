// @vitest-environment jsdom
import { act } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import type { JobMarketCompensation } from '../schemas';
import { MarketGeographyMap } from './market-geography-map';

const regionalMetric = (
  overrides: Partial<JobMarketCompensation>,
): JobMarketCompensation => ({
  segment: 'local',
  regionSlug: 'europe',
  regionLabel: 'Europe',
  regionType: 'continent',
  countryCode: null,
  medianMonthlyUsd: 8_500,
  p25MonthlyUsd: 6_500,
  p75MonthlyUsd: 10_500,
  adjustedPremiumPercent: 2,
  sampleCount: 50,
  employerCount: 20,
  onsiteCount: 35,
  hybridCount: 15,
  remoteCount: 0,
  activeJobs: 90,
  hiringCompanies: 40,
  activeOnsiteJobs: 60,
  activeHybridJobs: 30,
  activeRemoteJobs: 0,
  reliable: true,
  ...overrides,
});

const geography: JobMarketCompensation[] = [
  regionalMetric({}),
  regionalMetric({
    regionSlug: 'north-america',
    regionLabel: 'North America',
  }),
  regionalMetric({
    regionSlug: 'germany',
    regionLabel: 'Germany',
    regionType: 'country',
    countryCode: 'DE',
    medianMonthlyUsd: 10_000,
    p25MonthlyUsd: 8_000,
    p75MonthlyUsd: 12_000,
    sampleCount: 24,
    employerCount: 12,
    activeJobs: 30,
    hiringCompanies: 18,
    activeOnsiteJobs: 20,
    activeHybridJobs: 10,
  }),
  regionalMetric({
    regionSlug: 'france',
    regionLabel: 'France',
    regionType: 'country',
    countryCode: 'FRA',
    medianMonthlyUsd: null,
    p25MonthlyUsd: null,
    p75MonthlyUsd: null,
    sampleCount: 2,
    employerCount: 2,
    activeJobs: 11,
    hiringCompanies: 8,
    activeOnsiteJobs: 7,
    activeHybridJobs: 4,
    reliable: false,
  }),
];

afterEach(cleanup);

describe('MarketGeographyMap', () => {
  it('hydrates its country SVG without replacing server markup', async () => {
    (
      globalThis as typeof globalThis & {
        IS_REACT_ACT_ENVIRONMENT?: boolean;
      }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    const element = (
      <MarketGeographyMap
        geography={geography}
        classification='cl-engineering'
      />
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(element);
    document.body.append(container);
    const initialMarkup = container.innerHTML;

    const root = hydrateRoot(container, element);
    await act(async () => {});

    expect(container.innerHTML).toBe(initialMarkup);
    await act(async () => root.unmount());
    container.remove();
  });

  it('maps and links countries while labelling continent salary fallback', () => {
    const { container } = render(
      <MarketGeographyMap
        geography={geography}
        classification='cl-engineering'
      />,
    );

    expect(
      screen.getByRole('img', {
        name: /local monthly salaries by country/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Open Europe jobs' })).toBeNull();
    expect(
      screen.getByRole('link', { name: 'Open Germany jobs' }),
    ).toHaveAttribute('href', '/l-germany?classifications=engineering');
    expect(
      screen.getByRole('link', { name: 'Open France jobs' }),
    ).toHaveAttribute('href', '/l-france?classifications=engineering');
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('$10K/mo')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByText('$8.5K/mo')).toBeInTheDocument();
    expect(screen.getByText('Europe fallback')).toBeInTheDocument();
    expect(
      screen.getByText('Country data · fixed $3K–$20K scale'),
    ).toBeInTheDocument();
    const inactiveUnitedStates = [...container.querySelectorAll('path')].find(
      (path) =>
        path.querySelector('title')?.textContent?.includes('United States'),
    );
    expect(inactiveUnitedStates).toHaveAttribute('fill', '#18181b');
  });
});
