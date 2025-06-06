import { BASE_URL } from '@/lib/jobs/core/endpoints';
import { JobItemSchema } from '@/lib/jobs/core/schemas';
import { MOCK_RESPONSE_RESULT } from '@/lib/shared/testutils/core';

import {
  MockInfiniteListQueryOptions,
  mockInfiniteListResponse,
} from '@/lib/shared/testutils/mock-infinite-list-response';

import { fakeJobItem } from '@/lib/jobs/test-utils/fake-job-item';

type Option = { result: MOCK_RESPONSE_RESULT } & Partial<
  Omit<MockInfiniteListQueryOptions<JobItemSchema>, 'result'>
>;

export const mockJobListResponse = (options: Option) => {
  return mockInfiniteListResponse({
    baseURL: BASE_URL,
    itemFakeFn: () => fakeJobItem(),
    ...options,
  });
};
