import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchJobDetails } from '@/features/jobs/server/data';
import { JobDetailsPage } from '@/features/jobs/components/job-details';

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchJobDetails({ id });

  if (!job) {
    return { title: 'Job Not Found | JobStash' };
  }

  const title = job.organization
    ? `${job.title} at ${job.organization.name} | JobStash`
    : `${job.title} | JobStash`;

  return {
    title,
    description: job.summary ?? `View details for ${job.title}`,
  };
}

const JobDetailsRoute = async ({ params }: Props) => {
  const { id } = await params;
  const job = await fetchJobDetails({ id });

  if (!job) {
    notFound();
  }

  return <JobDetailsPage job={job} />;
};

export default JobDetailsRoute;
