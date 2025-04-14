'use client';

import { ItemBadge } from './item-badge';
import { useHeaderFilterItems } from './use-header-filter-items';

export const HeaderFilterItems = () => {
  const items = useHeaderFilterItems();
  if (items.length === 0) return null;
  return (
    <div className='flex w-full flex-wrap items-center justify-start gap-1.5'>
      {items.map((props) => (
        <ItemBadge key={props.label} {...props} />
      ))}
    </div>
  );
};
