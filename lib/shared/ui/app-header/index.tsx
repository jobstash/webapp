import { CollapsibleWrapper } from './collapsible-wrapper';

/**
 * A header component that stays fixed at the top of the content area
 */
export const AppHeader = () => {
  return (
    <CollapsibleWrapper
      header={
        <div className='flex h-16 w-full items-center px-4'>
          Header Content - Always Visible
        </div>
      }
    >
      <div className='h-40 p-4'>
        This is some arbitrary content with significant height. It will disappear when
        scrolling down.
      </div>
    </CollapsibleWrapper>
  );
};
