export const FiltersAsideLayout = ({
  children,
}: React.PropsWithChildren): React.ReactElement => {
  return (
    <div className='flex w-full flex-col gap-4 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <div>
        <h2 className='font-medium'>Filters</h2>
        <p className='mt-0.5 text-xs text-muted-foreground'>
          Narrow the jobs that match you
        </p>
      </div>
      {children}
    </div>
  );
};
