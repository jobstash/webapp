export type MockResponseOptions = {
  networkDelay?: number | 'infinite';
};

export const DEFAULT_MOCK_RESPONSE_OPTIONS: MockResponseOptions = {
  networkDelay: 0,
};

export const enum MOCK_RESPONSE_RESULT {
  SUCCESS,
  ERROR,
  NETWORK_ERROR,
  INTERNAL_ERROR,
  EMPTY,
  END_OF_RESULTS,
}
