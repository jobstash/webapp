import { clientEnv } from '@/lib/env/client';

interface Props {
  params: Promise<{ slug: string }>;
}

const PillarPage = async ({ params }: Props) => {
  const { slug } = await params;

  const url = `${clientEnv.MW_URL}/search/pillar/details?nav=jobs&slug=${slug}`;
  const response = await fetch(url);
  const data = await response.json();

  return (
    <pre className='text-sm whitespace-pre-wrap'>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default PillarPage;
