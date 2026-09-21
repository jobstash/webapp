'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { clearSignInReturn, readSignInReturn } from '../lib/return-navigation';

function Restorer() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => {
    const saved = readSignInReturn();
    let current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    // Next can append the fragment twice when returning to a cached route.
    // Correct only that exact duplication of the saved sign-in destination.
    if (saved?.phase === 'returning') {
      const hash = new URL(saved.href, window.location.origin).hash;
      if (hash && current === saved.href + hash) {
        window.history.replaceState(window.history.state, '', saved.href);
        current = saved.href;
      }
    }
    if (!saved || saved.phase !== 'returning' || saved.href !== current) return;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    const stop = () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
    };
    const finish = () => {
      const currentReturn = readSignInReturn();
      if (
        currentReturn?.phase === 'returning' &&
        currentReturn.href === saved.href
      )
        clearSignInReturn();
      stop();
    };
    const cancel = () => finish();
    const restore = () => {
      if (stopped) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!saved.positionKnown && window.location.hash) {
          let id = window.location.hash.slice(1);
          try {
            id = decodeURIComponent(id);
          } catch {
            /* Use the literal fragment. */
          }
          const anchor = document.getElementById(id);
          if (anchor) {
            anchor.scrollIntoView();
            finish();
          }
          return;
        }
        window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
        if (Math.abs(window.scrollY - saved.y) < 2) finish();
      });
    };
    const observer = new ResizeObserver(restore);
    observer.observe(document.body);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', cancel);
    timer = setTimeout(finish, 5000);
    restore();
    return stop;
  }, [pathname, search]);
  return null;
}

export const ReturnScrollRestorer = () => (
  <Suspense>
    <Restorer />
  </Suspense>
);
