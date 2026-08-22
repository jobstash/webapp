import { describe, expect, it } from 'vitest';

import { shouldBypassImageOptimization } from './image-with-fallback';

describe('shouldBypassImageOptimization', () => {
  it('loads the Google favicon source directly', () => {
    expect(
      shouldBypassImageOptimization(
        'https://www.google.com/s2/favicons?domain=example.com&sz=64',
      ),
    ).toBe(true);
  });

  it('loads stored third-party logos directly', () => {
    expect(
      shouldBypassImageOptimization('https://cdn.example.com/logo.png'),
    ).toBe(true);
    expect(shouldBypassImageOptimization('//cdn.example.com/logo.png')).toBe(
      true,
    );
  });

  it('keeps local assets in the Next image optimizer', () => {
    expect(shouldBypassImageOptimization('/jobstash-logo.png')).toBe(false);
  });
});
