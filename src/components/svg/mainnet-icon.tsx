import { cn } from '@/lib/utils';

export const MainnetIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='cyan'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className={cn('h-3 w-3 fill-current', className)}
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
);
