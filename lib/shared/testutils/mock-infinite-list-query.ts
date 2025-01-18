import { delay, http, HttpResponse } from 'msw';

import { InfiniteListPageSchema } from '@/lib/shared/core/schemas';
import { MOCK_RESPONSE_RESULT } from '@/lib/shared/testutils/core';

const DEFAULT_ITEM_COUNT = 5;

interface Options<T> {
  baseURL: string;
  fakeFn: () => InfiniteListPageSchema<T>;
  result: MOCK_RESPONSE_RESULT;
  itemCount?: number;
  networkDelay?: number;
}

export const mockInfiniteListQuery = <T>(options: Options<T>) => {
  const {
    baseURL,
    fakeFn,
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
        data: fakeFn(),
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
        data: fakeFn(),
      });
    }

    throw new Error(`Unhandled result: ${result}`);
  });
};
