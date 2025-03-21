import { ClassValue } from 'clsx';

import { cn } from '@/lib/shared/utils';

type Props = {
  text: React.ReactNode;
  className?: ClassValue;
};

export const GradientText = (props: Props) => {
  const { text, className } = props;

  return (
    <span
      className={cn(
        'bg-300% bg-gradient-to-r from-[#8743FF] via-[#ffab1b] to-[#8743FF] bg-clip-text text-transparent',
        'animate-gradient-text',
        className,
      )}
    >
      {text}
    </span>
  );
};
