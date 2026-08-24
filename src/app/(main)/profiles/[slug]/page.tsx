import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import { PublicProfilePage } from '@/features/public-profiles/components';
import { getPublicProfileMetadataDescription } from '@/features/public-profiles/metadata';
import { fetchPublicProfile } from '@/features/public-profiles/server';
import { clientEnv } from '@/lib/env/client';

interface Props {
  params: Promise<{ slug: string }>;
}

const NOT_FOUND_METADATA: Metadata = { title: 'Profile Not Found' };

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const profile = await fetchPublicProfile(slug);
  if (!profile) return NOT_FOUND_METADATA;

  const title = profile.info.displayName;
  const description = getPublicProfileMetadataDescription(profile);
  const url = `${clientEnv.FRONTEND_URL}/profiles/${profile.canonicalSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { card: 'summary', title, description },
  };
};

const ProfilePage = async ({ params }: Props) => {
  const { slug } = await params;
  const profile = await fetchPublicProfile(slug);
  if (!profile) notFound();
  if (profile.canonicalSlug !== slug) {
    permanentRedirect(`/profiles/${profile.canonicalSlug}`);
  }

  return <PublicProfilePage profile={profile} />;
};

export default ProfilePage;
