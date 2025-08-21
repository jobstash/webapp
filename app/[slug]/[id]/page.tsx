import { notFound } from 'next/navigation';

import { fetchJobDetailsStaticParams } from '@/lib/jobs/server/data';
import { fetchStaticJobDetails } from '@/lib/jobs/server/data/fetch-static-job-details';

import { BackButton } from './back-button';

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

const Page = async (props: Props) => {
  const { id, slug } = await props.params;
  const job = await fetchStaticJobDetails(id);

  if (!job) {
    return notFound();
  }

  return (
    <>
      <div className='flex flex-col gap-4'>
        <BackButton />
        <h1>{slug}</h1>
        <pre>{JSON.stringify({ id, slug, org: job.organization?.name }, null, 2)}</pre>
      </div>
    </>
  );
};

export default Page;
