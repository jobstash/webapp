'use client';

import { SearchIcon } from 'lucide-react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md';
}

export const SearchButton = ({ size = 'md', ...props }: Props) => {
  const iconClass = size === 'sm' ? 'size-5' : 'size-6';

  return (
    <button
      type='submit'
      className='shrink-0 rounded-sm text-zinc-500 transition-colors hover:text-zinc-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400'
      aria-label='Search'
      {...props}
    >
      <SearchIcon className={iconClass} />
    </button>
  );
};
