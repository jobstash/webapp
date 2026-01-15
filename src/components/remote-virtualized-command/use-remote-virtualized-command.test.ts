// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({ data: undefined, isLoading: false })),
}));

// Mock useDebounce to return value immediately
vi.mock('@/hooks', () => ({
  useDebounce: vi.fn((value: string) => value),
}));

import { useRemoteVirtualizedCommand } from './use-remote-virtualized-command';

const defaultProps = {
  queryKeyPrefix: 'test',
  endpoint: (q: string) => `/api/search?q=${q}`,
  responseToValues: (data: string[]) => data,
  initialValues: ['initial-1', 'initial-2'],
  selectedValues: [],
};

describe('useRemoteVirtualizedCommand', () => {
  describe('initial state', () => {
    it('returns empty searchValue initially', () => {
      const { result } = renderHook(() =>
        useRemoteVirtualizedCommand(defaultProps),
      );

      expect(result.current.searchValue).toBe('');
    });

    it('returns initialValues as filteredValues when no search', () => {
      const { result } = renderHook(() =>
        useRemoteVirtualizedCommand(defaultProps),
      );

      expect(result.current.filteredValues).toEqual(['initial-1', 'initial-2']);
    });

    it('returns isEmpty false when initialValues exist', () => {
      const { result } = renderHook(() =>
        useRemoteVirtualizedCommand(defaultProps),
      );

      expect(result.current.isEmpty).toBe(false);
    });
  });

  describe('filtering', () => {
    it('excludes selectedValues from filteredValues', () => {
      const { result } = renderHook(() =>
        useRemoteVirtualizedCommand({
          ...defaultProps,
          initialValues: ['a', 'b', 'c'],
          selectedValues: ['b'],
        }),
      );

      expect(result.current.filteredValues).toEqual(['a', 'c']);
    });

    it('returns isEmpty true when all values are selected', () => {
      const { result } = renderHook(() =>
        useRemoteVirtualizedCommand({
          ...defaultProps,
          initialValues: ['a', 'b'],
          selectedValues: ['a', 'b'],
        }),
      );

      expect(result.current.isEmpty).toBe(true);
    });

    it('returns isEmpty true when initialValues is empty', () => {
      const { result } = renderHook(() =>
        useRemoteVirtualizedCommand({
          ...defaultProps,
          initialValues: [],
          selectedValues: [],
        }),
      );

      expect(result.current.isEmpty).toBe(true);
    });
  });

  describe('handleSelect', () => {
    it('calls onSelect with the selected value', () => {
      const onSelect = vi.fn();
      const { result } = renderHook(() =>
        useRemoteVirtualizedCommand({
          ...defaultProps,
          onSelect,
        }),
      );

      result.current.handleSelect('test-value');

      expect(onSelect).toHaveBeenCalledWith('test-value');
    });

    it('clears searchValue after selection', () => {
      const { result } = renderHook(() =>
        useRemoteVirtualizedCommand({
          ...defaultProps,
          onSelect: vi.fn(),
        }),
      );

      // Set search value first
      act(() => {
        result.current.setSearchValue('search');
      });
      expect(result.current.searchValue).toBe('search');

      // Select should clear it
      act(() => {
        result.current.handleSelect('test-value');
      });
      expect(result.current.searchValue).toBe('');
    });

    it('does not throw when onSelect is undefined', () => {
      const { result } = renderHook(() =>
        useRemoteVirtualizedCommand({
          ...defaultProps,
          onSelect: undefined,
        }),
      );

      expect(() => result.current.handleSelect('test-value')).not.toThrow();
    });
  });

  describe('loading state', () => {
    it('returns empty filteredValues when isLoading is true', () => {
      vi.mocked(useQuery).mockReturnValue({
        data: ['loaded-1', 'loaded-2'],
        isLoading: true,
      } as unknown as ReturnType<typeof useQuery>);

      const { result } = renderHook(() =>
        useRemoteVirtualizedCommand({
          ...defaultProps,
          initialValues: ['initial-1'],
        }),
      );

      expect(result.current.filteredValues).toEqual([]);
      expect(result.current.isLoading).toBe(true);
    });

    it('returns fetched data when loading completes', () => {
      vi.mocked(useQuery).mockReturnValue({
        data: ['fetched-1', 'fetched-2'],
        isLoading: false,
      } as ReturnType<typeof useQuery>);

      const { result } = renderHook(() =>
        useRemoteVirtualizedCommand(defaultProps),
      );

      expect(result.current.filteredValues).toEqual(['fetched-1', 'fetched-2']);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
