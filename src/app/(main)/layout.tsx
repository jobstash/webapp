import { AppHeader } from '@/components/app-header/app-header';
import { AppFooter } from '@/components/app-footer/app-footer';

type Props = Readonly<React.PropsWithChildren>;

const MainLayout = ({ children }: Props) => (
  <>
    <AppHeader />
    <main className='mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-2 pt-4 lg:min-h-[calc(100vh-5rem)]'>
      {children}
    </main>
    <AppFooter />
  </>
);

export default MainLayout;
