'use client';

import { LinkWithLoader } from '@/components/link-with-loader';

import { useProfileCompleteness } from '../hooks/use-profile-completeness';

export const ProfileCompleteness = () => {
  const { percentage, items } = useProfileCompleteness();
  const incompleteItems = items.filter((item) => !item.isComplete);

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className='flex flex-col items-center gap-3 rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
      <div className='relative size-24'>
        <svg className='size-24 -rotate-90' viewBox='0 0 100 100'>
          <circle
            cx='50'
            cy='50'
            r='40'
            fill='none'
            stroke='currentColor'
            strokeWidth='8'
            className='text-accent'
          />
          <circle
            cx='50'
            cy='50'
            r='40'
            fill='none'
            stroke='currentColor'
            strokeWidth='8'
            strokeLinecap='round'
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className='text-emerald-500 transition-all duration-500'
          />
        </svg>
        <span className='absolute inset-0 flex items-center justify-center text-lg font-semibold'>
          {percentage}%
        </span>
      </div>

      <span className='text-xs font-medium text-muted-foreground'>
        Profile completeness
      </span>

      {incompleteItems.length > 0 && (
        <div className='flex w-full flex-col gap-1'>
          {incompleteItems.map((item) => (
            <LinkWithLoader
              key={item.label}
              href={item.href}
              className='text-xs text-muted-foreground transition-colors hover:text-foreground'
            >
              + {item.label}
            </LinkWithLoader>
          ))}
        </div>
      )}
    </div>
  );
};
