// import { fetchPillarDeets } from '@/lib/search/data/fetch-pillar-deets';
import { fetchStaticPillarSlugs } from '@/lib/search/data/fetch-static-pillar-slugs';

export const generateStaticParams =
  process.env.DISABLE_STATIC_GENERATION === 'true'
    ? undefined
    : async () => fetchStaticPillarSlugs();

interface Props {
  params: Promise<{ title: string }>;
}

const Page = async (props: Props) => {
  const { title } = await props.params;
  // const deets = await fetchPillarDeets(title);
  return <p>{JSON.stringify({ title }, null, 2)}</p>;
};

export default Page;
