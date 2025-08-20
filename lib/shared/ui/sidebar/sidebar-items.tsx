import Link from 'next/link';

import { formatNumber } from '@/lib/shared/utils/format-number';

import { Badge } from '@/lib/shared/ui/base/badge';
import { Button } from '@/lib/shared/ui/base/button';

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  count?: number;
}

const SidebarItem = ({ icon, label, count, href }: SidebarItemProps) => {
  return (
    <Button asChild variant='secondary' size='lg' className='grow justify-between px-4'>
      <Link href={href}>
        <div className='flex items-center gap-2'>
          {icon}
          <span className='text-sm text-neutral-400'>{label}</span>
        </div>
        {typeof count === 'number' && (
          <Badge variant='secondary' className='rounded-sm bg-white/5'>
            {formatNumber(count)}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

interface Props {
  items: SidebarItemProps[];
}

export const SidebarItems = ({ items }: Props) => {
  return (
    <div className='flex flex-col gap-4 pl-1'>
      {items.map((props) => (
        <SidebarItem key={props.label} {...props} />
      ))}
    </div>
  );
};
