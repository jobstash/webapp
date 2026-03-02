import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { parseStack } from './parse-stack';

describe('parseStack', () => {
  it('parses named frames', () => {
    const stack = `Error: test
    at handleClick (http://localhost:3000/main.js:10:5)
    at onClick (http://localhost:3000/main.js:20:10)`;

    const frames = parseStack(stack);

    expect(frames).toHaveLength(2);
    expect(frames[0]).toEqual({
      filename: 'http://localhost:3000/main.js',
      function: 'onClick',
      lineno: 20,
      colno: 10,
      in_app: true,
    });
    expect(frames[1]).toEqual({
      filename: 'http://localhost:3000/main.js',
      function: 'handleClick',
      lineno: 10,
      colno: 5,
      in_app: true,
    });
  });

  it('parses anonymous frames', () => {
    const stack = `Error: test
    at http://localhost:3000/main.js:5:3`;

    const frames = parseStack(stack);

    expect(frames).toHaveLength(1);
    expect(frames[0]).toEqual({
      filename: 'http://localhost:3000/main.js',
      function: '?',
      lineno: 5,
      colno: 3,
      in_app: true,
    });
  });

  it('marks node_modules frames as not in_app', () => {
    const stack = `Error: test
    at render (http://localhost:3000/node_modules/react/index.js:42:7)`;

    const frames = parseStack(stack);

    expect(frames).toHaveLength(1);
    expect(frames[0]!.in_app).toBe(false);
  });

  it('returns empty array for empty input', () => {
    expect(parseStack('')).toEqual([]);
  });

  it('returns frames reversed (innermost last)', () => {
    const stack = `Error: test
    at outer (http://localhost:3000/a.js:1:1)
    at inner (http://localhost:3000/b.js:2:2)`;

    const frames = parseStack(stack);

    expect(frames[0]!.function).toBe('inner');
    expect(frames[1]!.function).toBe('outer');
  });
});
