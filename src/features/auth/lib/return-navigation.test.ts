// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearSignInReturn,
  loginHref,
  markSignInReturn,
  readSignInReturn,
  safeReturnPath,
  saveSignInReturn,
  startSignInReturn,
} from './return-navigation';

beforeEach(() => {
  sessionStorage.clear();
  window.history.replaceState({}, '', '/?page=3&tags=react#jobs');
});

describe('sign-in return destinations', () => {
  it.each([
    'https://evil.test',
    '//evil.test',
    '/\\evil.test',
    '/%5cevil.test',
    '/%2fevil.test',
    '/login?redirect=/login',
    '/api/auth/session',
    '/_next/data',
    '/%6cogin',
    '/bad\npath',
    '/%00bad',
    '/%invalid',
  ])('rejects %s', (path) => expect(safeReturnPath(path)).toBe('/'));
  it('preserves filters, page and fragment through the login URL', () => {
    const path = '/lt-fully-remote?page=3&tags=react#jobs';
    expect(safeReturnPath(path)).toBe(path);
    expect(
      new URL(loginHref(path), window.location.origin).searchParams.get(
        'redirect',
      ),
    ).toBe(path);
  });
  it('keeps position and label through settings, reload and return', () => {
    vi.stubGlobal('scrollX', 0);
    vi.stubGlobal('scrollY', 860);
    startSignInReturn('/?page=3&tags=react#jobs', 'Back to job');
    markSignInReturn('/?page=3&tags=react#jobs', 'setup');
    expect(readSignInReturn()).toMatchObject({
      y: 860,
      label: 'Back to job',
      phase: 'setup',
    });
    markSignInReturn('/?page=3&tags=react#jobs', 'returning');
    expect(readSignInReturn()?.y).toBe(860);
    clearSignInReturn();
    expect(readSignInReturn()).toBeNull();
  });
  it('starts explicit destinations at the top and replaces previous attempts', () => {
    startSignInReturn('/?page=3&tags=react#jobs');
    startSignInReturn('/profile/jobs');
    expect(readSignInReturn()).toMatchObject({
      href: '/profile/jobs',
      x: 0,
      y: 0,
      phase: 'login',
    });
  });
  it('ignores corrupt or unsafe saved destinations', () => {
    sessionStorage.setItem('jobstash:sign-in-return', '{');
    expect(readSignInReturn()).toBeNull();
    saveSignInReturn({
      href: '//evil.test',
      label: 'Bad',
      x: 0,
      y: 0,
      phase: 'setup',
    });
    expect(readSignInReturn()).toBeNull();
  });
});
