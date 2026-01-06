import { Button, type ButtonProps } from '@/components/ui/button';
import { filterIconMap } from '@/features/filters/components/filter-icon-map';

interface Props extends ButtonProps {
  label: string;
  paramKey: string;
}

export const SuggestedFilterLabelButton = ({
  label,
  paramKey,
  ...props
}: Props) => {
  const icon = filterIconMap[paramKey];
  return (
    <Button
      size='xs'
      className='h-7 items-center gap-1.5 border border-dashed bg-sidebar text-muted-foreground/80 hover:bg-muted'
      {...props}
    >
      {icon}
      {label}
    </Button>
  );
};
