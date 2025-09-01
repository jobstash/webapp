import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { generateJobMetadata, generateJobNotFoundMetadata } from '@/lib/jobs/utils';

import { fetchJobDetailsStaticParams } from '@/lib/jobs/server/data';
import { fetchStaticJobDetails } from '@/lib/jobs/server/data/fetch-static-job-details';

import { JobDetailsPage } from '@/lib/jobs/pages/job-details.page';

export const generateStaticParams =
  process.env.DISABLE_STATIC_GENERATION === 'true'
    ? undefined
    : async () => {
        return fetchJobDetailsStaticParams();
      };

interface Props {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, slug } = await params;
  const job = await fetchStaticJobDetails(id);

  if (!job) {
    return generateJobNotFoundMetadata();
  }

  return generateJobMetadata({ job, slug, id });
}

const Page = async (props: Props) => {
  const { id, slug } = await props.params;
  const job = await fetchStaticJobDetails(id);

  if (!job) {
    return notFound();
  }

  return <JobDetailsPage id={id} slug={slug} />;
};
export default Page;
