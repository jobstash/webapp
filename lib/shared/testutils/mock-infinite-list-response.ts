import { delay, http, HttpResponse } from 'msw';

import { MOCK_RESPONSE_RESULT } from '@/lib/shared/testutils/core';

const DEFAULT_ITEM_COUNT = 5;

export interface MockInfiniteListQueryOptions<T> {
  baseURL: string;
  itemFakeFn: () => T;
  result: MOCK_RESPONSE_RESULT;
  itemCount?: number;
  networkDelay?: number;
}

export const mockInfiniteListResponse = <T>(options: MockInfiniteListQueryOptions<T>) => {
  const {
    baseURL,
    itemFakeFn,
    result,
    itemCount = DEFAULT_ITEM_COUNT,
    networkDelay = 0,
  } = options;

  return http.get(baseURL, async ({ request }) => {
    if (networkDelay) await delay(networkDelay);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;

    if (result === MOCK_RESPONSE_RESULT.SUCCESS) {
      return HttpResponse.json({
        page,
        total: itemCount * 5,
        data: Array.from({ length: itemCount }).map(itemFakeFn),
      });
    }

    if (result === MOCK_RESPONSE_RESULT.ERROR) {
      return new HttpResponse(null, { status: 400 });
    }

    if (result === MOCK_RESPONSE_RESULT.NETWORK_ERROR) {
      return HttpResponse.error();
    }

    if (result === MOCK_RESPONSE_RESULT.INTERNAL_ERROR) {
      return new HttpResponse(null, { status: 500 });
    }

    if (result === MOCK_RESPONSE_RESULT.EMPTY) {
      return HttpResponse.json({
        page,
        total: 0,
        data: [],
      });
    }

    if (result === MOCK_RESPONSE_RESULT.END_OF_RESULTS) {
      if (page >= 2) {
        return HttpResponse.json({
          page,
          total: itemCount,
          data: [],
        });
      }

      return HttpResponse.json({
        page,
        total: itemCount,
        data: Array.from({ length: itemCount }).map(itemFakeFn),
      });
    }

    throw new Error(`Unhandled result: ${result}`);
  });
};
