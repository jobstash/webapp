import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import { JobDetailsPage } from '@/features/jobs/components/job-details';
import { JobPostingSchema } from '@/features/jobs/components/job-posting-schema';
import {
  fetchJobDetails,
  fetchJobDetailsStaticParams,
} from '@/features/jobs/server/data';
import { clientEnv } from '@/lib/env/client';

export const generateStaticParams =
  process.env.DISABLE_STATIC_GENERATION === 'true' ||
  process.env.NODE_ENV === 'development'
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

  if (!job) return { title: 'Job Not Found' };

  const title = job.organization
    ? `${job.title} at ${job.organization.name}`
    : job.title;

  const description = job.summary ?? `View details for ${job.title}`;
  const canonicalUrl = `${clientEnv.FRONTEND_URL}${job.href}`;
  const keywords = job.tags.map((tag) => tag.name);

  // og/twitter titles inherit the templated page title when unset.
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      description,
    },
  };
};

const JobDetailsRoute = async ({ params }: Props) => {
  const { slug, id } = await params;
  const job = await fetchJobDetails({ id });

  if (!job) notFound();

  const requestedPath = `/${slug}/${id}`;
  if (requestedPath !== job.href) permanentRedirect(job.href);

  return (
    <>
      <JobPostingSchema job={job} />
      <JobDetailsPage job={job} />
    </>
  );
};

export default JobDetailsRoute;
