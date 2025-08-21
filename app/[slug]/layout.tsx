import { SidebarLayout } from '@/lib/shared/layouts/sidebar-layout';

const DetailsAside = () => {
  return (
    <div className='flex flex-col gap-8 rounded-2xl bg-sidebar p-6'>
      <div className='h-[600px] rounded-2xl bg-muted' />
    </div>
  );
};

const Layout = ({ children }: React.PropsWithChildren) => {
  return <SidebarLayout sidebar={<DetailsAside />}>{children}</SidebarLayout>;
};
export default Layout;
