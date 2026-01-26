import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JobDetailsPage } from '@/features/jobs/components/job-details';
import { JobPostingSchema } from '@/features/jobs/components/job-posting-schema';
import {
  fetchJobDetails,
  fetchJobDetailsStaticParams,
} from '@/features/jobs/server/data';
import { clientEnv } from '@/lib/env/client';

export const generateStaticParams =
  process.env.DISABLE_STATIC_GENERATION === 'true'
    ? undefined
    : async () => fetchJobDetailsStaticParams();

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params;
  const job = await fetchJobDetails({ id });

  if (!job) return { title: 'Job Not Found | JobStash' };

  const title = job.organization
    ? `${job.title} at ${job.organization.name} | JobStash`
    : `${job.title} | JobStash`;

  const description = job.summary ?? `View details for ${job.title}`;
  const canonicalUrl = `${clientEnv.FRONTEND_URL}${job.href}`;
  const imageUrl = job.organization?.logo ?? '/og-image.png';
  const keywords = job.tags.map((tag) => tag.name);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'JobStash',
      type: 'website',
      images: [imageUrl],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [imageUrl],
    },
  };
};

const JobDetailsRoute = async ({ params }: Props) => {
  const { id } = await params;
  const job = await fetchJobDetails({ id });

  if (!job) notFound();

  return (
    <>
      <JobPostingSchema job={job} />
      <JobDetailsPage job={job} />
    </>
  );
};

export default JobDetailsRoute;
