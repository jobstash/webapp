import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const isSomeCondition = false;
    expect(cn('foo', isSomeCondition && 'bar', 'baz')).toBe('foo baz');
  });

  it('resolves tailwind conflicts (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });
});
