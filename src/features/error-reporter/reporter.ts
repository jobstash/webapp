import type { Breadcrumb, ErrorPayload } from './schemas';

const MAX_BREADCRUMBS = 20;
const breadcrumbs: Breadcrumb[] = [];

const pushBreadcrumb = (type: Breadcrumb['type'], label: string): void => {
  breadcrumbs.push({ type, label, timestamp: Date.now() });
  if (breadcrumbs.length > MAX_BREADCRUMBS) breadcrumbs.shift();
};

const getClickLabel = (target: HTMLElement | null): string => {
  if (!target) return 'unknown';

  const tag = target.tagName.toLowerCase();
  const testId = target.getAttribute('data-testid');
  const ariaLabel = target.getAttribute('aria-label');
  const text = target.textContent?.trim().slice(0, 60);

  // Build identifier: prefer data-testid > aria-label > text content
  const identifier = testId ?? ariaLabel ?? text ?? tag;

  // Find nearest meaningful ancestor for context
  const ancestor = target.closest('[data-testid], [role], form, nav, aside');
  const context =
    ancestor?.getAttribute('data-testid') ?? ancestor?.tagName.toLowerCase();

  if (context && context !== tag && ancestor !== target) {
    return `${identifier} (${tag} in ${context})`;
  }

  return `${identifier} (${tag})`;
};

export const initReporter = (): (() => void) => {
  const handleClick = (e: MouseEvent): void => {
    pushBreadcrumb('click', getClickLabel(e.target as HTMLElement | null));
  };

  const originalPushState = history.pushState.bind(history);
  history.pushState = (...args) => {
    originalPushState(...args);
    pushBreadcrumb('navigation', String(args[2] ?? location.pathname));
  };

  document.addEventListener('click', handleClick, { capture: true });

  return () => {
    document.removeEventListener('click', handleClick, { capture: true });
    history.pushState = originalPushState;
  };
};

// Dedup window prevents error loops (e.g. a component that throws on every
// re-render) from flooding the server with identical sendBeacon requests.
// The server rate limit is a separate security concern for abuse prevention.
const DEDUP_MS = 5_000;
const recentErrors = new Map<string, number>();

export const reportError = (error: Error): void => {
  const now = Date.now();
  const lastSent = recentErrors.get(error.message);
  if (lastSent && now - lastSent < DEDUP_MS) return;
  recentErrors.set(error.message, now);

  const payload: ErrorPayload = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    url: location.href,
    timestamp: Date.now(),
    breadcrumbs: [...breadcrumbs],
  };

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    });
    navigator.sendBeacon('/api/error', blob);
  }
};
