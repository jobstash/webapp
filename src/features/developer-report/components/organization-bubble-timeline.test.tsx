// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { DeveloperOrganization } from '../schemas';
import { OrganizationBubbleTimeline } from './organization-bubble-timeline';

vi.mock('@/features/job-market/components/flint-echart', () => ({
  FlintEChart: ({ ariaLabel }: { ariaLabel: string }) => (
    <div role='img' aria-label={ariaLabel} />
  ),
}));

afterEach(cleanup);

const organization = (periods: string[]): DeveloperOrganization => ({
  organizationKey: 'github:example',
  organizationId: 'example',
  organizationName: 'Example',
  organizationSlug: 'example',
  vertical: 'crypto',
  logoUrl: null,
  layoutX: 0,
  layoutY: 0,
  communityId: 1,
  allContributors: 10,
  activeDevelopers: 10,
  internalDevelopers: 5,
  canonicalInternalPeople: 5,
  maintainers: 2,
  leads: 1,
  creditedOriginalCommits: 20,
  activeRepositories: 2,
  series: periods.map((period) => ({
    period,
    activeDevelopers: 10,
    internalDevelopers: 5,
    activeMaintainers: 2,
    activeLeads: 1,
  })),
});

describe('OrganizationBubbleTimeline', () => {
  it('clamps the selected month while a report range shrinks', () => {
    const view = render(
      <OrganizationBubbleTimeline
        organizations={[
          organization(['2026-05-01', '2026-06-01', '2026-07-01']),
        ]}
        scopeLabel='Crypto'
        rangeLabel='Since inception'
      />,
    );

    expect(screen.getByText('July 2026')).toBeInTheDocument();

    view.rerender(
      <OrganizationBubbleTimeline
        organizations={[organization(['2026-01-01'])]}
        scopeLabel='Crypto'
        rangeLabel='Last year'
      />,
    );

    expect(screen.getByText('January 2026')).toBeInTheDocument();
  });
});
