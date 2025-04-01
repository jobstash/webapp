export const createParamsQueryKey = (params?: Record<string, string>) => {
  if (!params) return '';
  const sortedKeys = Object.keys(params).sort();
  const stableParams: Record<string, string> = {};
  for (const key of sortedKeys) {
    stableParams[key] = params[key];
  }
  return JSON.stringify(stableParams);
};
