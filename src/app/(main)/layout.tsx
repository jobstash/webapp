import { AppHeader } from '@/components/app-header/app-header';
import { AppFooter } from '@/components/app-footer/app-footer';

type Props = Readonly<React.PropsWithChildren>;

const MainLayout = ({ children }: Props) => (
  <>
    <AppHeader />
    <main className='mx-auto max-w-7xl px-2 pt-4'>{children}</main>
    <AppFooter />
  </>
);

export default MainLayout;
