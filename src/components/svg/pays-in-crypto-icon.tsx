import { cn } from '@/lib/utils';

export const PaysInCryptoIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='13'
    height='13'
    viewBox='0 0 64 64'
    className={cn('mt-0.75 stroke-white stroke-2 md:mt-0', className)}
    {...props}
  >
    <path d='M32 56 16 32 32 8l16 24-16 24z' />
    <path d='m16 32 16 8 16-8' />
    <path d='M32 8v48' />
  </svg>
);
