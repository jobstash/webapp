'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorPresence() {
  const path = usePathname();
  useEffect(() => {
    let pending = false;
    const send = async () => {
      if (pending || document.visibilityState !== 'visible') return;
      pending = true;
      try {
        await fetch('/api/visitor-activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path }),
          signal: AbortSignal.timeout(3000),
        });
      } catch {
        /* Reporting never blocks the page. */
      } finally {
        pending = false;
      }
    };
    void send();
    const interval = setInterval(() => void send(), 60_000);
    const visible = () => void send();
    document.addEventListener('visibilitychange', visible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [path]);
  return null;
}
