import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { slugify } from './slugify';

describe('slugify', () => {
  it('converts basic strings to lowercase slugs', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('handles null and undefined', () => {
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
  });

  it('handles slashes with surrounding spaces', () => {
    expect(slugify('Europe / Remote')).toBe('europe-remote');
  });

  it('handles slashes without surrounding spaces', () => {
    expect(slugify('Europe/Remote')).toBe('europe-remote');
  });

  it('handles slashes with asymmetric spaces', () => {
    expect(slugify('Europe/ Remote')).toBe('europe-remote');
    expect(slugify('Europe /Remote')).toBe('europe-remote');
  });

  it('handles multiple slashes', () => {
    expect(slugify('A/B/C')).toBe('a-b-c');
  });

  it('handles commas', () => {
    expect(slugify('USA, Remote')).toBe('usa-remote');
  });

  it('handles dashes', () => {
    expect(slugify('Full-Time')).toBe('full-time');
  });
});
