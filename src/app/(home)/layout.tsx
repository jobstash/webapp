const HomeLayout = ({ children }: Readonly<React.PropsWithChildren>) => {
  return (
    <main className='space-y-4 pb-16'>
      <section className='grid h-[400px] w-full place-items-center rounded-2xl bg-sidebar'>
        <p className='text-2xl font-medium text-muted-foreground'>
          Hero + Pillar Items
        </p>
      </section>
      {children}
    </main>
  );
};

export default HomeLayout;
