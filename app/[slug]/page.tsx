// import { fetchPillarDeets } from '@/lib/search/data/fetch-pillar-deets';
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
  // const deets = await fetchPillarDeets(title);
  return <p>{JSON.stringify({ slug }, null, 2)}</p>;
};

export default Page;
