// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  recommendationPreferenceDefaults,
  type JobPreferences,
} from '../job-preferences';
import { JOB_PREFERENCE_FIELD_IDS } from '../jobs-for-me-resolution';

const { mockUseMutation, mockUseQuery, mockUseQueryClient } = vi.hoisted(
  () => ({
    mockUseMutation: vi.fn(),
    mockUseQuery: vi.fn(),
    mockUseQueryClient: vi.fn(),
  }),
);

vi.mock('@tanstack/react-query', () => ({
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  useQueryClient: () => mockUseQueryClient(),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { JobPreferencesForm } from './job-preferences-form';

const preferences: JobPreferences = {
  ...recommendationPreferenceDefaults,
  workModes: ['remote'],
  residenceCountry: null,
  utcOffset: null,
  workAuthorization: null,
  requiresSponsorship: null,
  attendancePreference: null,
  travelTolerance: null,
};

describe('JobPreferencesForm action destinations', () => {
  beforeEach(() => {
    mockUseQuery.mockReturnValue({
      data: preferences,
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });
    mockUseMutation.mockReturnValue({
      isPending: false,
      isError: false,
      isSuccess: false,
      mutate: vi.fn(),
    });
    mockUseQueryClient.mockReturnValue({
      setQueryData: vi.fn(),
      invalidateQueries: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('focuses the requested field and keeps a safe path back to the origin', async () => {
    window.history.replaceState(
      {},
      '',
      `/profile/settings?returnTo=%2Fprofile%2Fjobs#${JOB_PREFERENCE_FIELD_IDS.utcOffset}`,
    );

    render(<JobPreferencesForm />);

    const utcOffset = await screen.findByLabelText('UTC offset');
    await waitFor(() => expect(utcOffset).toHaveFocus());
    expect(
      screen.getByRole('link', { name: 'Back to Jobs for me' }),
    ).toHaveAttribute('href', '/profile/jobs');
  });

  it('renders every mapped preference-field destination', async () => {
    render(<JobPreferencesForm />);

    await screen.findByLabelText('Country (two-letter code)');
    for (const id of Object.values(JOB_PREFERENCE_FIELD_IDS)) {
      expect(document.getElementById(id)).toBeInstanceOf(HTMLElement);
    }
    expect(screen.getByLabelText('What matters most')).toBeVisible();
    expect(screen.getByLabelText('Job categories')).toBeVisible();
    expect(screen.getByLabelText('Skills')).toBeVisible();
    expect(screen.getByLabelText('Companies you want')).toBeVisible();
    expect(screen.getByLabelText('Minimum annual salary')).toBeVisible();
    expect(screen.getByLabelText('Search status')).toBeVisible();
    expect(screen.getByLabelText('Showcase repositories')).toBeVisible();
  });

  it('does not render a return action for an external target', async () => {
    window.history.replaceState(
      {},
      '',
      '/profile/settings?returnTo=https%3A%2F%2Fexample.com',
    );

    render(<JobPreferencesForm />);

    await screen.findByLabelText('Country (two-letter code)');
    expect(
      screen.queryByRole('link', { name: 'Back to Jobs for me' }),
    ).not.toBeInTheDocument();
  });

  it('explains the disabled save action when no work mode is selected', async () => {
    mockUseQuery.mockReturnValue({
      data: { ...preferences, workModes: [] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<JobPreferencesForm />);

    expect(
      await screen.findByText(
        'Select at least one work mode above before saving.',
      ),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Save preferences' }),
    ).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Remote' })).toBeEnabled();
  });
});
