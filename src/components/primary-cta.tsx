import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

interface PrimaryCTAProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
}

export const PrimaryCTA = ({
  asChild,
  className,
  ...props
}: PrimaryCTAProps) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <div className='w-fit rounded-lg bg-linear-to-r from-[#8743FF] to-[#D68800] p-0.5'>
      <Comp
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-[calc(var(--radius-lg)-2px)] bg-sidebar px-6 font-semibold text-white transition-colors hover:bg-sidebar/80',
          className,
        )}
        {...props}
      />
    </div>
  );
};
