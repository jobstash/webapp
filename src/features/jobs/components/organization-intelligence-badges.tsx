import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { LinkWithLoader } from '@/components/link-with-loader';
import type { JobOrganizationSchema } from '@/features/jobs/schemas';

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

interface OrganizationIntelligenceBadgesProps {
  organization: JobOrganizationSchema;
  includeEcosystemLink?: boolean;
}

export const OrganizationIntelligenceBadges = ({
  organization,
  includeEcosystemLink = false,
}: OrganizationIntelligenceBadgesProps) => {
  const badges: Array<{ label: string; href?: string }> = [];
  const hasCurrentTeamCoverage = organization.teamCoverageStatus === 'current';

  if (organization.fundingStage) {
    badges.push({
      label: organization.fundingStage,
      href: `/fs-${slugify(organization.fundingStage)}`,
    });
  }
  if (organization.recentlyFunded) badges.push({ label: 'Recently funded' });
  if (hasCurrentTeamCoverage && organization.currentMaintainerCount !== null) {
    const maintainerLabel =
      organization.currentMaintainerCount === 1
        ? 'current maintainer'
        : 'current maintainers';
    badges.push({
      label: `${organization.currentMaintainerCount} ${maintainerLabel}`,
    });
  }
  if (hasCurrentTeamCoverage && organization.activeLeadCount !== null) {
    const leadLabel =
      organization.activeLeadCount === 1 ? 'active lead' : 'active leads';
    badges.push({ label: `${organization.activeLeadCount} ${leadLabel}` });
  }
  if (hasCurrentTeamCoverage && (organization.newActiveLeadCount ?? 0) > 0) {
    const label =
      organization.newActiveLeadCount === 1
        ? 'new active lead'
        : 'new active leads';
    badges.push({ label: `${organization.newActiveLeadCount} ${label}` });
  }
  if (hasCurrentTeamCoverage && (organization.steppedDownLeadCount ?? 0) > 0) {
    const label =
      organization.steppedDownLeadCount === 1
        ? 'lead step-down'
        : 'lead step-downs';
    badges.push({ label: `${organization.steppedDownLeadCount} ${label}` });
  }
  if (hasCurrentTeamCoverage && (organization.movedLeadCount ?? 0) > 0) {
    const label =
      organization.movedLeadCount === 1 ? 'lead movement' : 'lead movements';
    badges.push({ label: `${organization.movedLeadCount} ${label}` });
  }
  if (
    hasCurrentTeamCoverage &&
    (organization.earlyLeadDepartureCount ?? 0) > 0
  ) {
    const label =
      organization.earlyLeadDepartureCount === 1
        ? 'early lead departure'
        : 'early lead departures';
    badges.push({ label: `${organization.earlyLeadDepartureCount} ${label}` });
  }
  if (
    hasCurrentTeamCoverage &&
    organization.newActiveLeadCount === null &&
    organization.growingTeam
  ) {
    badges.push({ label: 'New active leads' });
  }
  if (
    hasCurrentTeamCoverage &&
    organization.steppedDownLeadCount === null &&
    organization.shrinkingTeam
  ) {
    badges.push({ label: 'Lead step-downs' });
  }
  if (
    hasCurrentTeamCoverage &&
    organization.earlyLeadDepartureCount === null &&
    organization.earlyTeamShrinkage
  ) {
    badges.push({ label: 'Early lead departures' });
  }

  if (badges.length === 0 && !includeEcosystemLink) return null;

  return (
    <div className='flex flex-wrap gap-1.5'>
      {badges.map((badge) =>
        badge.href ? (
          <Badge key={badge.label} variant='secondary' asChild>
            <LinkWithLoader href={badge.href}>{badge.label}</LinkWithLoader>
          </Badge>
        ) : (
          <Badge key={badge.label} variant='secondary'>
            {badge.label}
          </Badge>
        ),
      )}
      {includeEcosystemLink && (
        <Badge variant='outline' asChild>
          <Link
            href={
              hasCurrentTeamCoverage
                ? `${organization.intelligenceUrl}/team`
                : organization.intelligenceUrl
            }
            target='_blank'
            rel='noopener noreferrer'
          >
            {hasCurrentTeamCoverage
              ? 'Team intelligence'
              : 'Company intelligence'}
            <ExternalLinkIcon className='size-3' />
          </Link>
        </Badge>
      )}
    </div>
  );
};
