// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { usePrevious } from './use-previous';

describe('usePrevious', () => {
  it('returns initial value on first render', () => {
    const { result } = renderHook(() => usePrevious('initial', false));
    expect(result.current).toBe('initial');
  });

  it('retains previous value when shouldUpdate is false', () => {
    const { result, rerender } = renderHook(
      ({ value, shouldUpdate }) => usePrevious(value, shouldUpdate),
      { initialProps: { value: 'first', shouldUpdate: false } },
    );

    expect(result.current).toBe('first');

    rerender({ value: 'second', shouldUpdate: false });
    expect(result.current).toBe('first');
  });

  it('updates value when shouldUpdate is true', () => {
    const { result, rerender } = renderHook(
      ({ value, shouldUpdate }) => usePrevious(value, shouldUpdate),
      { initialProps: { value: 'first', shouldUpdate: true } },
    );

    expect(result.current).toBe('first');

    rerender({ value: 'second', shouldUpdate: true });
    expect(result.current).toBe('second');
  });
});
