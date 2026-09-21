// @vitest-environment jsdom
import { cleanup, render, act } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('next/navigation', () => ({
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(window.location.search),
}));
import { ReturnScrollRestorer } from './return-scroll-restorer';
import { readSignInReturn, saveSignInReturn } from '../lib/return-navigation';
let resized: () => void;
beforeEach(() => {
  vi.useFakeTimers();
  sessionStorage.clear();
  window.history.replaceState({}, '', '/?page=2');
  vi.stubGlobal('scrollY', 0);
  vi.stubGlobal(
    'scrollTo',
    vi.fn(({ top }: { top: number }) => vi.stubGlobal('scrollY', top)),
  );
  vi.stubGlobal('requestAnimationFrame', (fn: () => void) =>
    setTimeout(fn, 16),
  );
  vi.stubGlobal('cancelAnimationFrame', clearTimeout);
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(fn: () => void) {
        resized = fn;
      }
      observe() {}
      disconnect() {}
    },
  );
  saveSignInReturn({
    href: '/?page=2',
    label: 'Back',
    x: 0,
    y: 720,
    positionKnown: true,
    phase: 'returning',
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it('restores once and clears the completed return', () => {
  render(<ReturnScrollRestorer />);
  act(() => vi.advanceTimersByTime(20));
  expect(window.scrollTo).toHaveBeenCalledWith({
    top: 720,
    left: 0,
    behavior: 'instant',
  });
  expect(readSignInReturn()).toBeNull();
});
it('waits for enough content to render without losing the saved position', () => {
  vi.stubGlobal('scrollTo', vi.fn());
  render(<ReturnScrollRestorer />);
  act(() => vi.advanceTimersByTime(20));
  expect(readSignInReturn()).not.toBeNull();
  vi.stubGlobal(
    'scrollTo',
    vi.fn(({ top }: { top: number }) => vi.stubGlobal('scrollY', top)),
  );
  act(() => {
    resized();
    vi.advanceTimersByTime(20);
  });
  expect(readSignInReturn()).toBeNull();
});
it('does not restore on an unrelated page', () => {
  window.history.replaceState({}, '', '/other');
  render(<ReturnScrollRestorer />);
  act(() => vi.advanceTimersByTime(20));
  expect(window.scrollTo).not.toHaveBeenCalled();
  expect(readSignInReturn()).not.toBeNull();
});
it('stops when the user scrolls instead of fighting them', () => {
  render(<ReturnScrollRestorer />);
  window.dispatchEvent(new Event('wheel'));
  act(() => vi.advanceTimersByTime(20));
  expect(window.scrollTo).not.toHaveBeenCalled();
  expect(readSignInReturn()).toBeNull();
});
