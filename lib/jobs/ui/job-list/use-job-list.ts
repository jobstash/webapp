import { useInView } from 'react-intersection-observer';

import { useJobListQuery } from './use-job-list-query';

export const useJobList = (startPage?: number) => {
  const {
    isLoading,
    isFetchingNextPage: isLoadingNextPage,
    isError,
    fetchNextPage,
    data,
    hasNextPage,
  } = useJobListQuery(startPage);

  const { ref: inViewRef } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (inView && !isLoading && hasNextPage && !isLoadingNextPage) {
        fetchNextPage();
      }
    },
  });

  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const isListIndicatorVisible = items.length > 0;

  return {
    isLoading,
    isLoadingNextPage,
    isError,
    inViewRef,
    items,
    isListIndicatorVisible,
    isEndReached: !hasNextPage,
  };
};
