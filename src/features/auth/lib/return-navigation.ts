export const RETURN_STORAGE_KEY = 'jobstash:sign-in-return';

export interface SignInReturn {
  href: string;
  label: string;
  x: number;
  y: number;
  positionKnown?: boolean;
  completionPromptDismissed?: boolean;
  phase: 'login' | 'setup' | 'returning';
}

const hasUnsafeCharacters = (value: string) =>
  Array.from(value).some(
    (character) => character === '\\' || character.charCodeAt(0) <= 32,
  );

/** Only application pages may be used as a sign-in destination. */
export function safeReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || hasUnsafeCharacters(value))
    return '/';
  try {
    const url = new URL(value, 'https://jobstash.invalid');
    const path = decodeURIComponent(url.pathname);
    if (
      url.origin !== 'https://jobstash.invalid' ||
      hasUnsafeCharacters(path) ||
      path.startsWith('//') ||
      /^\/(?:login|api|_next)(?:\/|$)/i.test(path)
    )
      return '/';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/';
  }
}

/** Job detail pages use /[slug]/[id]; named sections take precedence. */
export function returnPageLabel(href: string): string {
  const path = new URL(safeReturnPath(href), 'https://jobstash.invalid')
    .pathname;
  const parts = path.split('/').filter(Boolean);
  const section = parts[0];
  const job =
    parts.length === 2 &&
    ![
      'profile',
      'profiles',
      'developers',
      'api',
      '_next',
      'login',
      'sitemaps',
    ].includes(section);
  return job ? 'Back to job' : 'Back to previous page';
}

export const loginHref = (href: string) =>
  `/login?redirect=${encodeURIComponent(safeReturnPath(href))}`;

export function readSignInReturn(): SignInReturn | null {
  try {
    const data = JSON.parse(
      sessionStorage.getItem(RETURN_STORAGE_KEY) ?? 'null',
    );
    if (
      !data ||
      safeReturnPath(data.href) !== data.href ||
      !['login', 'setup', 'returning'].includes(data.phase) ||
      typeof data.label !== 'string' ||
      !Number.isFinite(data.x) ||
      !Number.isFinite(data.y) ||
      data.x < 0 ||
      data.y < 0
    )
      return null;
    return data as SignInReturn;
  } catch {
    return null;
  }
}

export function saveSignInReturn(data: SignInReturn): void {
  try {
    sessionStorage.setItem(RETURN_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* Navigation still works without browser storage. */
  }
}

export function clearSignInReturn(): void {
  try {
    sessionStorage.removeItem(RETURN_STORAGE_KEY);
  } catch {
    /* Storage can be unavailable. */
  }
}

export function startSignInReturn(
  href: string,
  label = returnPageLabel(href),
): SignInReturn {
  const target = safeReturnPath(href);
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const data: SignInReturn = {
    href: target,
    label,
    x: target === current ? Math.max(0, window.scrollX) : 0,
    y: target === current ? Math.max(0, window.scrollY) : 0,
    positionKnown: target === current,
    phase: 'login',
  };
  saveSignInReturn(data);
  return data;
}

export function markSignInReturn(
  href: string,
  phase: SignInReturn['phase'],
): void {
  const target = safeReturnPath(href);
  const existing = readSignInReturn();
  saveSignInReturn(
    existing?.href === target
      ? { ...existing, phase }
      : { href: target, label: returnPageLabel(target), x: 0, y: 0, phase },
  );
}
