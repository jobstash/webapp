import { cn } from '@/lib/utils';

interface ProfileCardProps {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const ProfileCard = ({
  id,
  title,
  children,
  className,
}: ProfileCardProps) => (
  <div
    id={id}
    className={cn(
      'rounded-2xl border border-neutral-800/50 bg-sidebar p-4',
      className,
    )}
  >
    {title && <h2 className='mb-3 text-lg font-semibold'>{title}</h2>}
    {children}
  </div>
);
