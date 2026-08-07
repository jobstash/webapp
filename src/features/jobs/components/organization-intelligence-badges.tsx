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
  if (hasCurrentTeamCoverage && organization.growingTeam) {
    badges.push({ label: 'Growing team' });
  }
  if (hasCurrentTeamCoverage && organization.shrinkingTeam) {
    badges.push({ label: 'Maintainer moves' });
  }
  if (hasCurrentTeamCoverage && organization.earlyTeamShrinkage) {
    badges.push({ label: 'Early-team moves' });
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
            href={organization.intelligenceUrl}
            target='_blank'
            rel='noopener noreferrer'
          >
            Company intelligence
            <ExternalLinkIcon className='size-3' />
          </Link>
        </Badge>
      )}
    </div>
  );
};
