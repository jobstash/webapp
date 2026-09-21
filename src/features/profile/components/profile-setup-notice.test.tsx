// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  isEditorOpen: false,
  action: vi.fn(),
  profile: {
    isPending: false,
    isError: false,
    isComplete: false,
    completionMap: { email: true },
    retry: vi.fn(),
  },
}));
vi.mock('@bprogress/next/app', () => ({ useRouter: () => mocks }));
vi.mock('next/navigation', () => ({
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(window.location.search),
}));
vi.mock('../hooks/use-profile-completeness', () => ({
  useProfileCompleteness: () => mocks.profile,
}));
vi.mock('./profile-editor-provider', () => ({
  useProfileEditor: () => ({ isEditorOpen: mocks.isEditorOpen }),
}));
vi.mock('./profile-strength-card', () => ({
  useProfileCompletionAction: () => mocks.action,
}));
import { ProfileSetupNotice } from './profile-setup-notice';
import {
  saveSignInReturn,
  readSignInReturn,
} from '@/features/auth/lib/return-navigation';
beforeEach(() => {
  vi.clearAllMocks();
  mocks.isEditorOpen = false;
  sessionStorage.clear();
  mocks.profile.isComplete = false;
  mocks.profile.isPending = false;
  mocks.profile.isError = false;
  window.history.replaceState({}, '', '/profile/settings');
  saveSignInReturn({
    href: '/job/example#apply',
    label: 'Back to job',
    x: 0,
    y: 800,
    phase: 'setup',
  });
});
afterEach(cleanup);
it('explains repeated setup visits and lets incomplete users return immediately', () => {
  render(<ProfileSetupNotice />);
  expect(screen.getByText(/each time you sign in until/)).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Back to job' }));
  expect(mocks.push).toHaveBeenCalledWith('/job/example#apply', {
    scroll: false,
  });
  expect(readSignInReturn()).toMatchObject({ phase: 'returning', y: 800 });
});
it('opens existing editors and omits completed steps', () => {
  render(<ProfileSetupNotice />);
  expect(screen.queryByRole('button', { name: 'Add Email' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Add Skills' }));
  expect(mocks.action).toHaveBeenCalledWith('skills-editor');
});
it('prompts when the last missing detail is completed and returns to the original job', () => {
  const { rerender } = render(<ProfileSetupNotice />);
  expect(screen.queryByRole('dialog')).toBeNull();
  mocks.profile.isComplete = true;
  rerender(<ProfileSetupNotice />);
  const dialog = screen.getByRole('dialog', { name: 'Your profile is ready' });
  const back = within(dialog).getByRole('button', { name: 'Back to job' });
  expect(back).toHaveFocus();
  fireEvent.click(back);
  expect(mocks.push).toHaveBeenCalledWith('/job/example#apply', {
    scroll: false,
  });
});
it('waits until the profile editor closes before prompting', () => {
  mocks.profile.isComplete = true;
  mocks.isEditorOpen = true;
  const { rerender } = render(<ProfileSetupNotice />);
  expect(screen.queryByRole('dialog')).toBeNull();
  mocks.isEditorOpen = false;
  rerender(<ProfileSetupNotice />);
  expect(screen.getByRole('dialog')).toBeVisible();
});
it('lets the user stay on their profile without prompting again on reload', () => {
  mocks.profile.isComplete = true;
  const { unmount } = render(<ProfileSetupNotice />);
  fireEvent.click(screen.getByRole('button', { name: 'Stay on my profile' }));
  expect(readSignInReturn()?.completionPromptDismissed).toBe(true);
  unmount();
  render(<ProfileSetupNotice />);
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('button', { name: 'Back to job' })).toBeVisible();
});
it('retains the return action on the linked accounts page', () => {
  window.history.replaceState({}, '', '/profile#linked-accounts');
  render(<ProfileSetupNotice />);
  expect(screen.getByRole('button', { name: 'Back to job' })).toBeVisible();
});
it('offers retry without losing the destination when profile loading fails', () => {
  mocks.profile.isError = true;
  render(<ProfileSetupNotice />);
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(mocks.profile.retry).toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Back to job' })).toBeVisible();
});

it('does not prompt from old completion data while a saved edit is being refreshed', () => {
  mocks.profile.isComplete = true;
  mocks.profile.isPending = true;
  const { rerender } = render(<ProfileSetupNotice />);
  expect(screen.queryByRole('dialog')).toBeNull();
  mocks.profile.isPending = false;
  rerender(<ProfileSetupNotice />);
  expect(screen.getByRole('dialog')).toBeVisible();
});
