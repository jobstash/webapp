import { cn } from '@/lib/utils';

interface ProfileCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const ProfileCard = ({
  title,
  children,
  className,
}: ProfileCardProps) => (
  <div
    className={cn(
      'rounded-2xl border border-neutral-800/50 bg-sidebar p-4',
      className,
    )}
  >
    {title && <h2 className='mb-3 text-lg font-semibold'>{title}</h2>}
    {children}
  </div>
);
