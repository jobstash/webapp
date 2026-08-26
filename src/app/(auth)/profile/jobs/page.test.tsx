// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ProfileJobsPage from './page';

vi.mock('@/features/profile/components/jobs-for-me', () => ({
  JobsForMe: () => <div>Recommended results</div>,
}));

describe('Profile jobs page', () => {
  it('shows one activity-based job feed with short copy', () => {
    render(<ProfileJobsPage />);
    expect(screen.getByRole('heading', { name: 'Jobs for me' })).toBeVisible();
    expect(screen.getByText('Fresh matches from your activity.')).toBeVisible();
    expect(
      screen.getByRole('region', { name: 'Recommended jobs' }),
    ).toHaveTextContent('Recommended results');
  });
});
