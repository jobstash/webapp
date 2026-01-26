'use client';

import { type ClassValue } from 'clsx';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface Props extends React.PropsWithChildren {
  label: string;
  classNames?: {
    trigger?: ClassValue;
    content?: ClassValue;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: React.ReactNode;
  withDropdownIcon?: boolean;
  truncateLabel?: boolean;
}

export const FilterDropdown = (props: Props) => {
  const {
    label,
    children,
    classNames,
    open,
    onOpenChange,
    icon = null,
    withDropdownIcon = true,
    truncateLabel = true,
  } = props;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size='xs'
          variant='secondary'
          className={cn(
            'flex h-7 items-center gap-1.5 px-2',
            'text-sm',
            truncateLabel && 'max-w-32 min-w-0 shrink',
            classNames?.trigger,
          )}
        >
          {icon}
          <span
            className={cn(
              'flex-1 text-left',
              truncateLabel && 'min-w-0 truncate',
            )}
          >
            {label}
          </span>
          {withDropdownIcon && (
            <ChevronDownIcon className='size-3.5 shrink-0 text-neutral-400' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='start'
        className={cn(
          'relative flex flex-col gap-2',
          'w-fit max-w-60 min-w-32',
          classNames?.content,
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};
