'use client';

import { useEffect, useState } from 'react';

import { ClassValue } from 'clsx';

import { cn } from '@/lib/shared/utils';

interface Props extends React.PropsWithChildren {
  className?: ClassValue;
  classNames?: {
    base: ClassValue;
    innerWrapper: ClassValue;
  };
}

export const NavScrollWrapper = (props: Props) => {
  const { children, className, classNames } = props;

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      className={cn(
        'fixed z-10 mx-auto',
        'w-full',
        'transition-all duration-200 ease-linear',
        'px-2 pt-4 lg:px-0',
        isVisible ? 'translate-y-0' : '-translate-y-full',
        className,
        classNames?.base,
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-between gap-4 rounded-2xl text-sm md:flex-row',
          'mx-auto h-16 max-w-4xl py-4 pr-4 pl-2 [&>*]:w-full',
          'border border-neutral-900 bg-background/40 backdrop-blur-md',
          classNames?.innerWrapper,
        )}
      >
        {children}
      </div>
    </div>
  );
};
