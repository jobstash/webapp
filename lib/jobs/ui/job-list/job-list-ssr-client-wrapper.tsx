'use client';

import { useSearchParams } from 'next/navigation';

export const JobListSsrClientWrapper = ({ children }: React.PropsWithChildren) => {
  const searchParams = useSearchParams();
  const hasSearchParams = Array.from(searchParams.entries()).length > 0;
  if (hasSearchParams) return null;
  return <>{children}</>;
};
