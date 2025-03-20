interface Props {
  icon: React.ReactNode;
  label: string;
}

export const InfoTag = ({ icon, label }: Props) => {
  return (
    <div className={'flex h-6 shrink-0 items-center gap-x-2 py-1 pr-2'}>
      <div className='shrink-0'>{icon}</div>
      <span className='max-w-[32ch] truncate text-sm md:max-w-[44ch] lg:text-xs'>
        {label}
      </span>
    </div>
  );
};
