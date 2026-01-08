'use client';

import { LoaderIcon, XIcon } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePrevious } from '@/hooks';

interface Props extends Omit<ButtonProps, 'disabled'> {
  isPending: boolean;
  label: string;
  tooltipLabel?: string;
  onClose: () => void;
  icon?: React.ReactNode;
}

export const ActiveFilterTrigger = ({
  isPending,
  label,
  tooltipLabel,
  onClose,
  icon,
  ...props
}: Props) => {
  // Need to keep track of the label text
  // Nuqs causes the label to flash when the filter is removed
  const labelText = usePrevious(label, !isPending);

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='xs'
            variant='secondary'
            className='group flex h-7 items-center gap-1.5 border-none px-2 pr-3.5 [&_svg]:text-neutral-400'
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
            {labelText}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipLabel ?? label}</TooltipContent>
      </Tooltip>
      <ButtonGroupSeparator />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon-sm'
            variant='secondary'
            className='h-7 px-2'
            onClick={onClose}
            disabled={isPending}
          >
            <XIcon className='size-3.5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Remove filter</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
};
