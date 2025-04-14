// import { Button } from '@/lib/shared/ui/base/button';

interface Props {
  searchInput: React.ReactNode;
  filterItems: React.ReactNode;
}

export const DesktopHeader = ({ searchInput, filterItems }: Props) => {
  return (
    <div className='hidden min-h-16 w-full flex-col items-center gap-4 p-4 md:flex'>
      {searchInput}
      {filterItems}
      {/* <div className='hidden items-center md:flex'>
        <Button variant='ghost' size='sm'>
          Get Listed
        </Button>
        <Button variant='ghost' size='sm'>
          Subscribe on TG
        </Button>
      </div> */}
    </div>
  );
};
