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
  it('shows current maintainer metrics without the disabled intelligence link', () => {
    render(<OrganizationIntelligenceBadges organization={organization()} />);

    expect(screen.getByText('8 current maintainers')).toBeInTheDocument();
    expect(screen.getByText('3 active leads')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders nothing when coverage is unavailable and there are no funding badges', () => {
    render(
      <OrganizationIntelligenceBadges
        organization={organization({ teamCoverageStatus: 'unknown' })}
      />,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText('8 current maintainers')).not.toBeInTheDocument();
  });
});
