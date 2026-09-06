// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { useProfileSkillsEditor } from './use-profile-skills-editor';

vi.mock('@/lib/analytics', () => ({ GA_EVENT: {}, trackEvent: vi.fn() }));
vi.mock('@/features/profile/hooks/use-skills-search', () => ({
  useSkillsSearch: () => ({ setSearchValue: vi.fn(), availableSkills: [] }),
}));
vi.mock('@/features/profile/hooks/use-suggested-skills', () => ({
  useSuggestedSkills: () => ({ suggestedSkills: [] }),
}));

describe('profile skills editor', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('opens duplicates once, rejects rapid duplicate additions, and saves one ID per skill', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetch);
    const client = new QueryClient();
    const { result } = renderHook(
      () =>
        useProfileSkillsEditor([
          { id: 'old', name: 'DevOps', normalizedName: 'devops' },
          { id: 'duplicate', name: 'DevOps', normalizedName: 'devops' },
        ]),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <QueryClientProvider client={client}>{children}</QueryClientProvider>
        ),
      },
    );
    act(() => result.current.setIsOpen(true));
    expect(result.current.editedSkills.map((skill) => skill.id)).toEqual([
      'old',
    ]);
    act(() => {
      result.current.handleAddSkill({
        id: 'again',
        name: 'devops',
        colorIndex: 0,
        isFromResume: false,
      });
      result.current.handleAddSkill({
        id: 'python',
        name: 'Python',
        colorIndex: 0,
        isFromResume: false,
      });
      result.current.handleAddSkill({
        id: 'python-duplicate',
        name: 'Python',
        colorIndex: 1,
        isFromResume: false,
      });
    });
    expect(result.current.editedSkills.map((skill) => skill.name)).toEqual([
      'DevOps',
      'Python',
    ]);
    await act(() => result.current.handleSave());
    expect(JSON.parse(fetch.mock.calls[0][1].body).skills).toEqual([
      { id: 'old', name: 'DevOps' },
      { id: 'python', name: 'Python' },
    ]);
    expect(result.current.isOpen).toBe(false);
  });
});
