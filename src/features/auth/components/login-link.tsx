'use client';

import { Suspense, useEffect, useState, type ComponentProps } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from '@bprogress/next/app';
import { loginHref, startSignInReturn } from '../lib/return-navigation';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  destination?: string;
  returnLabel?: string;
};

function LoginLinkContent({
  destination,
  returnLabel,
  onClick,
  ...props
}: Props) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const router = useRouter();
  const [hash, setHash] = useState('');
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, [pathname, search]);
  const href = loginHref(
    destination ?? `${pathname}${search ? `?${search}` : ''}${hash}`,
  );
  return (
    <Link
      {...props}
      href={href}
      prefetch={false}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const target =
          destination ??
          `${window.location.pathname}${window.location.search}${window.location.hash}`;
        startSignInReturn(target, returnLabel);
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0 ||
          props.target === '_blank'
        )
          return;
        event.preventDefault();
        router.push(loginHref(target));
      }}
    />
  );
}

export function LoginLink(props: Props) {
  const { destination, returnLabel: _, ...linkProps } = props;
  return (
    <Suspense
      fallback={<Link {...linkProps} href={loginHref(destination ?? '/')} />}
    >
      <LoginLinkContent {...props} />
    </Suspense>
  );
}
