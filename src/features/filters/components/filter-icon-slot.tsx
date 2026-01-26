import { LoaderIcon } from 'lucide-react';

interface Props {
  isPending: boolean;
  icon?: React.ReactNode;
}

export const FilterIconSlot = ({ isPending, icon }: Props) => (
  <div className='grid size-4 place-items-center'>
    {isPending ? (
      <LoaderIcon className='shrink-0 animate-spin text-neutral-400' />
    ) : (
      icon
    )}
  </div>
);
