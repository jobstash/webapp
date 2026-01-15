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

import { SelectedItems } from './selected-items';

afterEach(() => {
  cleanup();
});

const defaultProps = {
  values: ['value-1', 'value-2'],
  formatLabel: (v: string) => v.toUpperCase(),
};

// Wrapper to provide Command context
const renderWithCommand = (ui: React.ReactElement) => {
  return render(<Command>{ui}</Command>);
};

describe('SelectedItems', () => {
  it('renders null when values is empty', () => {
    const { container } = render(
      <SelectedItems {...defaultProps} values={[]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders "Selected" heading when values exist', () => {
    renderWithCommand(<SelectedItems {...defaultProps} />);

    expect(screen.getByText('Selected')).toBeInTheDocument();
  });

  it('renders formatted labels for each value', () => {
    renderWithCommand(<SelectedItems {...defaultProps} />);

    expect(screen.getByText('VALUE-1')).toBeInTheDocument();
    expect(screen.getByText('VALUE-2')).toBeInTheDocument();
  });

  it('calls onDeselect when item is clicked', async () => {
    const onDeselect = vi.fn();
    const user = userEvent.setup();

    renderWithCommand(
      <SelectedItems {...defaultProps} onDeselect={onDeselect} />,
    );

    await user.click(screen.getByText('VALUE-1'));

    expect(onDeselect).toHaveBeenCalledWith('value-1');
  });

  it('does not throw when onDeselect is undefined', async () => {
    const user = userEvent.setup();

    renderWithCommand(
      <SelectedItems {...defaultProps} onDeselect={undefined} />,
    );

    await expect(
      user.click(screen.getByText('VALUE-1')),
    ).resolves.not.toThrow();
  });
});
