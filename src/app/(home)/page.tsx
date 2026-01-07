import { FiltersAside } from '@/features/filters/components/filters-aside';

const HomePage = () => {
  return (
    <div className='flex gap-4'>
      <div className='hidden w-68 lg:block'>
        <FiltersAside />
      </div>
      <div className='h-[6000px] grow'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <div className='col-span-1'>
            <p className='text-2xl font-medium'>Jobs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
