'use client';

import { createPortal } from 'react-dom';
import { useSearchToolsTarget } from '@/components/app-header/search-tools';

// Keep the page's filter context, but place its control inside the search bar.
export const JobListToolbar = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const target = useSearchToolsTarget();
  return target && children ? createPortal(children, target) : null;
};
