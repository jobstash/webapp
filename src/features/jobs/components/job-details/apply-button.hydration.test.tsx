// @vitest-environment jsdom
import { act } from '@testing-library/react';
import Link from 'next/link';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ pending: true }));
vi.mock('@/hooks/use-eligibility', () => ({
  useEligibility: () => ({ isExpert: false }),
}));
vi.mock('./use-job-apply-status', () => ({
  useJobApplyStatus: () => ({
    isAuthenticated: false,
    isAuthLoading: state.pending,
    isLoading: state.pending,
    status: null,
    applyUrl: null,
    missing: null,
  }),
}));
vi.mock('./use-job-apply', () => ({
  useJobApply: () => ({ isApplying: false, apply: vi.fn() }),
}));
vi.mock('./eligibility-nudge-dialog', () => ({
  EligibilityNudgeDialog: () => null,
}));
vi.mock('@/features/auth/components/login-link', () => ({
  LoginLink: ({
    children,
    returnLabel: _,
    ...props
  }: React.ComponentProps<'a'> & { returnLabel?: string }) => (
    <Link {...props} href='/login'>
      {children}
    </Link>
  ),
}));
import { ApplyButton } from './apply-button';

it('hydrates safely when sign-in status resolves before the lazy Apply button loads', async () => {
  const element = (
    <ApplyButton
      hasApplyUrl
      isExpertJob={false}
      jobId='job'
      jobTitle='Robotics Engineer'
      organization='Robotics Company'
      classification='Engineering'
    />
  );
  const container = document.createElement('div');
  document.body.appendChild(container);
  state.pending = true;
  container.innerHTML = renderToString(element);
  state.pending = false;
  const onRecoverableError = vi.fn();
  let root: ReturnType<typeof hydrateRoot>;
  try {
    await act(async () => {
      root = hydrateRoot(container, element, { onRecoverableError });
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container.querySelector('a')?.textContent).toContain('Apply Now');
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/login');
  } finally {
    await act(async () => {
      root?.unmount();
    });
    container.remove();
  }
});
