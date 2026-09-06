import { describe, expect, it } from 'vitest';
import { uniqueSkills } from './unique-skills';

describe('uniqueSkills', () => {
  it('keeps the existing skill when a CV or another page returns a different ID for it', () => {
    const existing = { id: 'old', name: 'DevOps', isFromResume: false };
    expect(
      uniqueSkills([
        existing,
        { id: 'new', name: ' devops ', isFromResume: true },
        existing,
      ]),
    ).toEqual([existing]);
  });
  it('hides selected skills from suggestions even under another ID', () => {
    expect(
      uniqueSkills(
        [
          { id: 'new', name: 'Python' },
          { id: 'ai-1', name: 'AI' },
          { id: 'ai-2', name: 'AI' },
        ],
        [{ id: 'old', name: 'Python' }],
      ),
    ).toEqual([{ id: 'ai-1', name: 'AI' }]);
  });
  it('preserves meaningful punctuation and rejects empty names', () => {
    const skills = [
      { id: 'c', name: 'C' },
      { id: 'cpp', name: 'C++' },
      { id: 'cs', name: 'C#' },
    ];
    expect(uniqueSkills([...skills, { id: 'empty', name: ' ' }])).toEqual(
      skills,
    );
  });
});
