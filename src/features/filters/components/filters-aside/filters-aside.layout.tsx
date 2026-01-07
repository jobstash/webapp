export const FiltersAsideLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className='sticky top-20 flex w-full flex-col gap-4 overflow-y-auto rounded-2xl border border-neutral-800/50 bg-sidebar p-4 lg:top-24'>
      <span className='font-medium'>Filters</span>
      {children}
    </div>
  );
};
