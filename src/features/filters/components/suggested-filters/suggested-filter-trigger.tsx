import { LoaderIcon } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';

interface Props extends ButtonProps {
  isPending: boolean;
  label: string;
  icon?: React.ReactNode;
}

export const SuggestedFilterTrigger = ({
  isPending,
  label,
  icon,
  ...props
}: Props) => {
  return (
    <Button
      size='xs'
      variant='secondary'
      className='flex h-7 items-center gap-1.5 border border-dashed bg-sidebar text-muted-foreground/80 hover:bg-muted'
      disabled={isPending}
      {...props}
    >
      <div className='grid size-4 place-items-center'>
        {isPending ? (
          <LoaderIcon className='shrink-0 animate-spin text-neutral-400' />
        ) : (
          icon
        )}
      </div>
      <span className='flex-1 text-left'>{label}</span>
    </Button>
  );
};
