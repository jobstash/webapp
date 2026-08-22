// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { JobOrganizationSchema } from '@/features/jobs/schemas';

import { OrganizationIntelligenceBadges } from './organization-intelligence-badges';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

afterEach(cleanup);

const organization = (
  overrides: Partial<JobOrganizationSchema> = {},
): JobOrganizationSchema => ({
  name: 'Safe',
  href: '/o-safe',
  websiteUrl: null,
  location: null,
  logo: null,
  employeeCount: null,
  summary: null,
  description: null,
  socials: null,
  projects: [],
  fundingRounds: [],
  investors: [],
  fundingStage: null,
  recentlyFunded: false,
  teamCoverageStatus: 'current',
  teamSignalsAsOf: '2026-08-01T00:00:00.000Z',
  currentMaintainerCount: 8,
  activeLeadCount: 3,
  newActiveLeadCount: 1,
  steppedDownLeadCount: 0,
  movedLeadCount: 0,
  earlyLeadDepartureCount: 0,
  intelligenceUrl: 'https://ecosystem.vision/organizations/info/safe',
  ...overrides,
});

describe('OrganizationIntelligenceBadges', () => {
  it('links current maintainer metrics directly to Ecosystem Vision team detail', () => {
    render(
      <OrganizationIntelligenceBadges
        includeEcosystemLink
        organization={organization()}
      />,
    );

    expect(screen.getByText('8 current maintainers')).toBeInTheDocument();
    expect(screen.getByText('3 active leads')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /team intelligence/i }),
    ).toHaveAttribute(
      'href',
      'https://ecosystem.vision/organizations/info/safe/team',
    );
  });

  it('falls back to company detail when maintainer coverage is unavailable', () => {
    render(
      <OrganizationIntelligenceBadges
        includeEcosystemLink
        organization={organization({ teamCoverageStatus: 'unknown' })}
      />,
    );

    expect(
      screen.getByRole('link', { name: /company intelligence/i }),
    ).toHaveAttribute(
      'href',
      'https://ecosystem.vision/organizations/info/safe',
    );
  });
});
