import { Button } from '@/components/ui/button';
import { FilterIconSlot } from '@/features/filters/components/filter-icon-slot';

interface Props extends React.ComponentProps<'button'> {
  isPending: boolean;
  label: string;
  icon?: React.ReactNode;
}

export const SuggestedFilterTrigger = ({
  isPending,
  label,
  icon,
  ...props
}: Props) => (
  <Button
    size='xs'
    variant='secondary'
    className='flex h-7 items-center gap-1.5 border border-dashed bg-sidebar text-muted-foreground/80 hover:bg-muted'
    disabled={isPending}
    {...props}
  >
    <FilterIconSlot isPending={isPending} icon={icon} />
    <span className='flex-1 text-left'>{label}</span>
  </Button>
);
