import { Brand } from '@/lib/shared/ui/brand';

/**
 * A sidebar component that appears on the left side of the layout
 */
export const AppSidebar = () => {
  return (
    <div className='flex flex-col gap-8'>
      <Brand />
      <div className='-mt-4 flex h-40 w-full items-center justify-center rounded-2xl border border-neutral-800/50 bg-sidebar px-4'>
        <span>Discover Tabs</span>
      </div>
      <div className='flex h-72 w-full items-center justify-center rounded-2xl border border-neutral-800/50 bg-sidebar px-4'>
        <span>Profile Tabs</span>
      </div>
    </div>
  );
};
