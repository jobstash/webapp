import { DesktopHeader } from './desktop-header';
import { MobileHeader } from './mobile-header';

interface Props {
  searchInput: React.ReactNode;
}

export const Header = ({ searchInput }: Props) => {
  return (
    <div className='sticky top-0 z-30 w-full overflow-hidden border border-neutral-800/50 bg-sidebar/50 backdrop-blur-lg lg:top-6 lg:mt-6 lg:rounded-2xl'>
      <MobileHeader />
      <DesktopHeader searchInput={searchInput} />
    </div>
  );
};
