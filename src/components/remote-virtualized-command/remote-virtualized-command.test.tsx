// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock ResizeObserver for cmdk
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// Mock scrollIntoView for cmdk
Element.prototype.scrollIntoView = vi.fn();

// Mock the hook
const mockHookReturn = {
  searchValue: '',
  setSearchValue: vi.fn(),
  debouncedSearch: '',
  isLoading: false,
  filteredValues: ['value-1', 'value-2'],
  isEmpty: false,
  handleSelect: vi.fn(),
};

vi.mock('./use-remote-virtualized-command', () => ({
  useRemoteVirtualizedCommand: vi.fn(() => mockHookReturn),
}));

// Mock useVirtualizer
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn(() => ({
    getTotalSize: () => 70,
    getVirtualItems: () => [
      { index: 0, start: 0, size: 35, end: 35, key: 0, lane: 0 },
      { index: 1, start: 35, size: 35, end: 70, key: 1, lane: 0 },
    ],
  })),
}));

import { useRemoteVirtualizedCommand } from './use-remote-virtualized-command';
import { RemoteVirtualizedCommand } from './remote-virtualized-command';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const defaultProps = {
  queryKeyPrefix: 'test',
  endpoint: (q: string) => `/api?q=${q}`,
  responseToValues: (data: string[]) => data,
  initialValues: ['init-1'],
  selectedValues: [],
  formatLabel: (v: string) => v.toUpperCase(),
};

describe('RemoteVirtualizedCommand', () => {
  beforeEach(() => {
    vi.mocked(useRemoteVirtualizedCommand).mockReturnValue(mockHookReturn);
  });

  it('renders input with placeholder', () => {
    render(
      <RemoteVirtualizedCommand {...defaultProps} placeholder='Type here...' />,
    );

    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
  });

  it('renders default placeholder when not provided', () => {
    render(<RemoteVirtualizedCommand {...defaultProps} />);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders filtered values as list items', () => {
    render(<RemoteVirtualizedCommand {...defaultProps} />);

    expect(screen.getByText('VALUE-1')).toBeInTheDocument();
    expect(screen.getByText('VALUE-2')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    vi.mocked(useRemoteVirtualizedCommand).mockReturnValue({
      ...mockHookReturn,
      isLoading: true,
    });

    render(<RemoteVirtualizedCommand {...defaultProps} />);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows SelectedItems when searchValue is empty', () => {
    vi.mocked(useRemoteVirtualizedCommand).mockReturnValue({
      ...mockHookReturn,
      searchValue: '',
    });

    render(
      <RemoteVirtualizedCommand
        {...defaultProps}
        selectedValues={['selected-1']}
      />,
    );

    expect(screen.getByText('Selected')).toBeInTheDocument();
  });

  it('hides SelectedItems when searchValue is not empty', () => {
    vi.mocked(useRemoteVirtualizedCommand).mockReturnValue({
      ...mockHookReturn,
      searchValue: 'typing',
    });

    render(
      <RemoteVirtualizedCommand
        {...defaultProps}
        selectedValues={['selected-1']}
      />,
    );

    expect(screen.queryByText('Selected')).not.toBeInTheDocument();
  });

  it('calls setSearchValue when input changes', async () => {
    const setSearchValue = vi.fn();
    vi.mocked(useRemoteVirtualizedCommand).mockReturnValue({
      ...mockHookReturn,
      setSearchValue,
    });

    const user = userEvent.setup();
    render(<RemoteVirtualizedCommand {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('Search...'), 'test');

    expect(setSearchValue).toHaveBeenCalled();
  });
});
