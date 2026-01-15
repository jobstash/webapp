// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Mock ResizeObserver for cmdk
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// Mock scrollIntoView for cmdk
Element.prototype.scrollIntoView = vi.fn();

import { Command } from '@/components/ui/command';

import { VirtualizedItems } from './virtualized-items';

afterEach(() => {
  cleanup();
});

const createVirtualItem = (index: number, start: number, size = 35) => ({
  index,
  start,
  size,
  end: start + size,
  key: index,
  lane: 0,
});

// Wrapper to provide Command context
const renderWithCommand = (ui: React.ReactElement) => {
  return render(<Command>{ui}</Command>);
};

describe('VirtualizedItems', () => {
  const defaultProps = {
    virtualItems: [createVirtualItem(0, 0), createVirtualItem(1, 35)],
    filteredValues: ['item-a', 'item-b'],
    formatLabel: (v: string) => v.toUpperCase(),
    onSelect: vi.fn(),
  };

  it('renders formatted labels for each virtual item', () => {
    renderWithCommand(<VirtualizedItems {...defaultProps} />);

    expect(screen.getByText('ITEM-A')).toBeInTheDocument();
    expect(screen.getByText('ITEM-B')).toBeInTheDocument();
  });

  it('renders nothing when virtualItems is empty', () => {
    const { container } = renderWithCommand(
      <VirtualizedItems {...defaultProps} virtualItems={[]} />,
    );

    expect(container.querySelector('[cmdk-item]')).not.toBeInTheDocument();
  });

  it('applies correct positioning styles', () => {
    renderWithCommand(<VirtualizedItems {...defaultProps} />);

    const firstItem = screen.getByText('ITEM-A').closest('[cmdk-item]');
    const secondItem = screen.getByText('ITEM-B').closest('[cmdk-item]');

    expect(firstItem).toHaveStyle({
      height: '35px',
      transform: 'translateY(0px)',
    });
    expect(secondItem).toHaveStyle({
      height: '35px',
      transform: 'translateY(35px)',
    });
  });

  it('calls onSelect with correct value when item is clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    renderWithCommand(
      <VirtualizedItems {...defaultProps} onSelect={onSelect} />,
    );

    await user.click(screen.getByText('ITEM-A'));

    expect(onSelect).toHaveBeenCalledWith('item-a');
  });
});
