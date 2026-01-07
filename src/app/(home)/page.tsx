import { SocialsAside } from '@/components/socials-aside';
import { FiltersAside } from '@/features/filters/components/filters-aside';

const HomePage = () => {
  return (
    <div className='flex gap-4'>
      <aside className='sticky top-20 hidden max-h-[calc(100vh-5rem)] w-68 flex-col gap-4 self-start overflow-y-auto lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)]'>
        <FiltersAside />
        <SocialsAside />
      </aside>
      <section className='h-[6000px] grow'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <div className='col-span-1'>
            <h1 className='text-2xl font-medium'>Jobs</h1>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
