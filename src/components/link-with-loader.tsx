'use client';

import Link from 'next/link';
import { useRouter } from '@bprogress/next/app';
import { useTransition } from 'react';

import { cn } from '@/lib/utils/index';

type LinkProps = React.ComponentProps<typeof Link>;

interface LinkWithLoaderProps extends Omit<LinkProps, 'children'> {
  /**
   * Position of the loader relative to children
   * @default 'right'
   */
  loaderPosition?: 'left' | 'right';
  /**
   * Optional loader element shown when navigation is pending
   */
  loader?: React.ReactNode;
  /**
   * Whether to scroll to top on navigation
   * @default true
   */
  scroll?: boolean;
  /**
   * Children can be a ReactNode or a render function receiving isPending state
   */
  children: React.ReactNode | ((isPending: boolean) => React.ReactNode);
}

export function LinkWithLoader({
  href,
  onClick,
  children,
  className,
  loaderPosition = 'right',
  loader,
  scroll = true,
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
      router.push(href.toString(), { scroll });
    });
  };

  const loaderElement = isPending && loader ? loader : null;
  const resolvedChildren =
    typeof children === 'function' ? children(isPending) : children;

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
      {resolvedChildren}
      {loaderPosition === 'right' && loaderElement}
    </Link>
  );
}
