'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * The scroll position threshold (in pixels) below which the header is always expanded
 */
const SCROLL_TOP_THRESHOLD = 10;

/**
 * The scroll distance threshold (in pixels) that triggers a collapse or expand action
 */
const SCROLL_DELTA_THRESHOLD = 15;

interface Props extends React.PropsWithChildren {
  /** The fixed header content to display. */
  header: React.ReactNode;
}

/**
 * A collapsible header component that changes height when scrolling down
 */
export const CollapsibleWrapper = ({ children, header }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Refs for measuring elements
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // State for storing measured heights
  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  // Function to measure heights
  const updateHeights = useCallback(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, []);

  // Measure heights after initial render and DOM is ready
  useLayoutEffect(() => {
    updateHeights();
  }, [updateHeights, children, header]);

  // Add resize observer to detect content size changes
  useEffect(() => {
    if (!headerRef.current || !contentRef.current) return;

    // Throttle resize observations
    let resizeObserverTicking = false;

    const handleElementResize = () => {
      if (!resizeObserverTicking) {
        window.requestAnimationFrame(() => {
          updateHeights();
          resizeObserverTicking = false;
        });
        resizeObserverTicking = true;
      }
    };

    const resizeObserver = new ResizeObserver(handleElementResize);

    // Observe both header and content elements
    resizeObserver.observe(headerRef.current);
    resizeObserver.observe(contentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateHeights]);

  // Add resize listener to update measurements when window size changes
  useEffect(() => {
    // Throttle resize events
    let resizeTicking = false;

    const handleResize = () => {
      if (!resizeTicking) {
        window.requestAnimationFrame(() => {
          updateHeights();
          resizeTicking = false;
        });
        resizeTicking = true;
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateHeights]);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Always expand when at the top
    if (currentScrollY < SCROLL_TOP_THRESHOLD) {
      setIsExpanded(true);
    }
    // Significant scroll down - collapse
    else if (currentScrollY > lastScrollY + SCROLL_DELTA_THRESHOLD) {
      setIsExpanded(false);
    }
    // Significant scroll up - expand
    else if (currentScrollY < lastScrollY - SCROLL_DELTA_THRESHOLD) {
      setIsExpanded(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    // Throttle scroll events
    let ticking = false;

    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [handleScroll]);

  const height = isExpanded ? headerHeight + contentHeight : headerHeight;

  return (
    <>
      <div
        className='sticky top-0 z-30 w-full overflow-hidden border border-neutral-800/50 bg-sidebar/30 backdrop-blur-md transition-all duration-400 ease-linear lg:top-6 lg:mt-6 lg:rounded-2xl'
        style={{
          height,
        }}
      >
        {/* Fixed height header section - always visible */}
        <div ref={headerRef}>{header}</div>

        {/* Expandable content section */}
        <div ref={contentRef} className='pb-8'>
          {children}
        </div>
      </div>

      {/* Gradient black fade below the header */}
      <div
        className='sticky top-0 z-20 hidden h-16 bg-gradient-to-t from-transparent to-background transition-all duration-400 ease-linear lg:block'
        style={{
          top: height + 22,
        }}
      />
    </>
  );
};
