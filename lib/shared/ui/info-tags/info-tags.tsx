import { MappedInfoTagSchema } from '@/lib/shared/core/schemas';

interface Props {
  iconMap: Record<string, React.ReactNode>;
  infoTags: MappedInfoTagSchema[];
}

export const InfoTags = ({ iconMap, infoTags }: Props) => {
  return (
    <div className='flex flex-wrap items-center gap-x-4 gap-y-1'>
      {infoTags.map(({ label, iconKey }) => {
        const isIconKey = iconKey in iconMap;
        if (!isIconKey) return null;

        const icon = iconMap[iconKey];

        return (
          <div key={iconKey} className={'flex h-6 shrink-0 gap-x-2 py-1 pr-2'}>
            {icon}
            <span className='max-w-[24ch] truncate text-sm md:max-w-[32ch] lg:max-w-[44ch] lg:text-xs'>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
