// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { SearchOverlay } from './search-overlay';
vi.mock('./search-results-list', () => ({ SearchResultsList: () => null }));
afterEach(cleanup);
it('submits with the keyboard without activating Back and clearing the query', async () => {
  const onSubmit = vi.fn();
  const onClose = vi.fn();
  const user = userEvent.setup();
  render(
    <SearchOverlay
      open
      query='engineer'
      onQueryChange={vi.fn()}
      onSubmit={onSubmit}
      onClose={onClose}
      onItemSelect={vi.fn()}
      availableGroups={[]}
      activeGroup=''
      items={[]}
      hasMore={false}
      isLoading={false}
      isLoadingMore={false}
      onGroupChange={vi.fn()}
      loadMore={vi.fn()}
    />,
  );
  await user.click(screen.getByPlaceholderText('Search...'));
  await user.keyboard('{Enter}');
  expect(onSubmit).toHaveBeenCalledOnce();
  expect(onClose).not.toHaveBeenCalled();
});
