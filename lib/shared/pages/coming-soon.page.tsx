import { SidebarAsideLayout } from '@/lib/shared/layouts/sidebar-aside-layout';

export const ComingSoonPage = () => {
  return (
    <SidebarAsideLayout>
      <div className='grid min-h-[calc(100dvh-140px)] place-items-center'>
        <div className='flex flex-col gap-4'>
          <h1 className='mb-4 text-4xl font-bold text-foreground/80 md:text-6xl'>
            Coming Soon
          </h1>
          <p className='text-lg text-muted-foreground md:text-xl'>
            This feature is currently under development.
          </p>
        </div>
      </div>
    </SidebarAsideLayout>
  );
};
