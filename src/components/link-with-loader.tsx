'use client';

import Link from 'next/link';
import { useRouter } from '@bprogress/next/app';
import { useTransition } from 'react';

import { cn } from '@/lib/utils/index';

type LinkProps = React.ComponentProps<typeof Link>;

interface LinkWithLoaderProps extends LinkProps {
  /**
   * Position of the loader relative to children
   * @default 'right'
   */
  loaderPosition?: 'left' | 'right';
  /**
   * Optional loader element shown when navigation is pending
   */
  loader?: React.ReactNode;
}

export function LinkWithLoader({
  href,
  onClick,
  children,
  className,
  loaderPosition = 'right',
  loader,
  ...props
}: LinkWithLoaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow modifier keys for opening in new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      onClick?.(e);
      return;
    }

    e.preventDefault();
    onClick?.(e);

    startTransition(() => {
      router.push(href.toString());
    });
  };

  const loaderElement = isPending && loader ? loader : null;

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2',
        isPending && 'pointer-events-none opacity-50',
        className,
      )}
      aria-busy={isPending || undefined}
      {...props}
    >
      {loaderPosition === 'left' && loaderElement}
      {children}
      {loaderPosition === 'right' && loaderElement}
    </Link>
  );
}
