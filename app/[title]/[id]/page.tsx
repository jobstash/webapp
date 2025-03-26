import { fetchJobDetails } from '@/lib/jobs/server/data/fetch-job-details';
import { fetchJobDetailsStaticParams } from '@/lib/jobs/server/data/fetch-job-details-static-params';

export const generateStaticParams = async () => {
  return fetchJobDetailsStaticParams();
};

interface Props {
  params: Promise<{
    title: string;
    id: string;
  }>;
}

const Page = async (props: Props) => {
  const { id, title } = await props.params;
  const job = await fetchJobDetails(id);
  return (
    <div>
      <h1>{title}</h1>
      <pre>{JSON.stringify(job, null, 2)}</pre>
    </div>
  );
};

export default Page;
