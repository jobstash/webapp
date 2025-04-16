interface Props {
  searchInput: React.ReactNode;
}

export const DesktopHeader = ({ searchInput }: Props) => {
  return (
    <div className='hidden min-h-16 w-full flex-col items-center gap-4 p-4 md:flex'>
      {searchInput}
    </div>
  );
};
