import { ClassValue } from 'clsx';

import { cn } from '@/lib/shared/utils';

/**
 * Available variants for the Divider component
 */
type DividerVariant = 'default' | 'lighter' | 'darker';

/**
 * Props for the Divider component
 */
interface Props {
  /** Additional classes to apply to the divider */
  className?: ClassValue;
  /** The visual style variant of the divider */
  variant?: DividerVariant;
}

/**
 * Maps divider variants to their respective border color classes
 */
const variantStyles: Record<DividerVariant, string> = {
  default: 'border-neutral-800',
  lighter: 'border-neutral-600/80',
  darker: 'border-neutral-800/80',
};

/**
 * A horizontal divider component with different visual variants
 */
export const Divider = ({ className, variant = 'default' }: Props) => {
  return (
    <div className='w-full'>
      <hr className={cn('border-t', variantStyles[variant], className)} />
    </div>
  );
};
