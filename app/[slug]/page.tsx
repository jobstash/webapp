import { fetchPillarDeets } from '@/lib/search/data/fetch-pillar-deets';
import { fetchStaticPillarSlugs } from '@/lib/search/data/fetch-static-pillar-slugs';

export const generateStaticParams =
  process.env.DISABLE_STATIC_GENERATION === 'true'
    ? undefined
    : async () => fetchStaticPillarSlugs();

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = async (props: Props) => {
  const { slug } = await props.params;
  const deets = await fetchPillarDeets(slug);
  return (
    <div className='max-w-xl space-y-4'>
      <h1>{deets.title}</h1>
      <p>{deets.description}</p>
    </div>
  );
};

export default Page;
