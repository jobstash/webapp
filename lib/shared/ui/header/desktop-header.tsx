import { Button } from '@/lib/shared/ui/base/button';

interface Props {
  searchInput: React.ReactNode;
}

export const DesktopHeader = ({ searchInput }: Props) => {
  return (
    <div className='hidden h-16 w-full items-center justify-between p-4 md:flex'>
      {searchInput}
      <div className='hidden items-center md:flex'>
        <Button variant='ghost' size='sm'>
          Get Listed
        </Button>
        <Button variant='ghost' size='sm'>
          Subscribe on TG
        </Button>
      </div>
    </div>
  );
};
