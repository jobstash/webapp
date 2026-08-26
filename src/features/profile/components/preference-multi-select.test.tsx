// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PreferenceMultiSelect } from './preference-multi-select';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;
Element.prototype.scrollIntoView = vi.fn();

describe('PreferenceMultiSelect', () => {
  afterEach(cleanup);

  it('shows choices and returns all selected values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <PreferenceMultiSelect
        label='Work modes you accept'
        value={['remote']}
        options={[
          { label: 'Remote', value: 'remote' },
          { label: 'Hybrid', value: 'hybrid' },
        ]}
        placeholder='Choose work modes'
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole('combobox', { name: 'Work modes you accept' }),
    );
    await user.click(screen.getByRole('option', { name: 'Hybrid' }));

    expect(onChange).toHaveBeenCalledWith(['remote', 'hybrid']);
  });

  it('adds a valid custom value from inside the dropdown', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <PreferenceMultiSelect
        label='Companies you want'
        value={[]}
        options={[]}
        placeholder='Choose or add companies'
        allowCustom
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole('combobox', { name: 'Companies you want' }),
    );
    await user.type(screen.getByPlaceholderText('Search choices…'), 'Acme');
    await user.click(screen.getByRole('option', { name: 'Add “Acme”' }));

    expect(onChange).toHaveBeenCalledWith(['Acme']);
  });
});
