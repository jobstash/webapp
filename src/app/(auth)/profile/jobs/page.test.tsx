// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ProfileJobsPage from './page';

vi.mock('@/features/profile/components/jobs-for-me', () => ({
  JobsForMe: () => <div>Work option results</div>,
}));

vi.mock('@/features/profile/components/profile-jobs', () => ({
  ProfileJobs: () => <div>Skill results</div>,
}));

describe('Profile jobs page', () => {
  it('keeps both canonical personalized-job capabilities reachable', () => {
    render(<ProfileJobsPage />);
    expect(screen.getByRole('heading', { name: 'Jobs for me' })).toBeVisible();
    expect(
      screen.getByRole('region', { name: 'Work preference matches' }),
    ).toHaveTextContent('Work option results');
    expect(
      screen.getByRole('region', { name: 'Skill matches' }),
    ).toHaveTextContent('Skill results');
  });
});
