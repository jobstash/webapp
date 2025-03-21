'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const SCROLL_TOP_THRESHOLD = 10;
const SCROLL_DELTA_THRESHOLD = 15;

interface Props extends React.PropsWithChildren {
  header: React.ReactNode;
}

export const CollapsibleWrapper = ({ children, header }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const lastScrollY = useRef(0); // Using ref instead of state for scroll position

  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const updateHeights = useCallback(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    if (contentRef.current) setContentHeight(contentRef.current.offsetHeight);
  }, []);

  useLayoutEffect(() => updateHeights(), [updateHeights]);
  useEffect(() => {
    const observer = new ResizeObserver(updateHeights);
    if (headerRef.current) observer.observe(headerRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [updateHeights]);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < SCROLL_TOP_THRESHOLD) {
      setIsExpanded(true);
    } else {
      const scrollDelta = currentScrollY - lastScrollY.current;
      if (Math.abs(scrollDelta) > SCROLL_DELTA_THRESHOLD) {
        setIsExpanded(scrollDelta < 0);
      }
    }

    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    const scrollListener = () => window.requestAnimationFrame(handleScroll);
    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [handleScroll]);

  const height = isExpanded ? headerHeight + contentHeight : headerHeight;

  return (
    <>
      <div
        className='sticky top-0 z-30 w-full overflow-hidden border border-neutral-800/50 bg-sidebar/30 backdrop-blur-md transition-all duration-400 ease-linear lg:top-6 lg:mt-6 lg:rounded-2xl'
        style={{ height }}
      >
        <div ref={headerRef}>{header}</div>
        <div ref={contentRef} className='pb-8'>
          {children}
        </div>
      </div>

      <div
        className='sticky top-0 z-20 hidden h-16 bg-gradient-to-t from-transparent to-background lg:block'
        style={{ transform: `translateY(${height + 22}px)` }}
      />
    </>
  );
};
