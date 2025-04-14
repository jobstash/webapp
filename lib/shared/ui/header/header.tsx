import { DesktopHeader } from './desktop-header';
import { MobileHeader } from './mobile-header';

interface Props {
  searchInput: React.ReactNode;
  filterItems: React.ReactNode;
}

export const Header = ({ searchInput, filterItems }: Props) => {
  return (
    <div className='sticky top-0 z-30 w-full overflow-hidden border border-neutral-800/50 bg-sidebar/30 backdrop-blur-md lg:top-6 lg:mt-6 lg:rounded-2xl'>
      <MobileHeader />
      <DesktopHeader searchInput={searchInput} filterItems={filterItems} />
    </div>
  );
};
