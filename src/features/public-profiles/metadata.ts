import type { PublicProfile } from './schemas';

export const getPublicProfileMetadataDescription = (
  profile: PublicProfile,
): string =>
  profile.info.summary ??
  profile.info.description ??
  profile.info.tagline ??
  `Organizations, projects, reviews, and salary aggregates for ${profile.info.displayName}.`;
