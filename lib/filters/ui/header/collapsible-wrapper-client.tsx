'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const SCROLL_TOP_THRESHOLD = 20;
const SCROLL_DELTA_THRESHOLD = 30;

export const CollapsibleWrapperClient = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const lastScrollY = useRef(0);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const updateHeights = useCallback(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    if (contentRef.current) setContentHeight(contentRef.current.offsetHeight + 2);
  }, []);

  // Find DOM elements on mount
  useEffect(() => {
    wrapperRef.current = document.querySelector('[data-collapsible-wrapper]');
    headerRef.current = document.querySelector('[data-collapsible-header]');
    contentRef.current = document.querySelector('[data-collapsible-content]');

    updateHeights();
  }, [updateHeights]);

  useLayoutEffect(() => updateHeights(), [updateHeights]);

  useEffect(() => {
    const observer = new ResizeObserver(updateHeights);
    if (headerRef.current) observer.observe(headerRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [updateHeights]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const height = isExpanded ? headerHeight + contentHeight : headerHeight;

    wrapperRef.current.style.height = `${height}px`;
  }, [isExpanded, headerHeight, contentHeight]);

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

  return null;
};
