export const createParamsQueryKey = (params?: Record<string, string>) => {
  if (!params) return '';
  const sortedKeys = Object.keys(params).sort();
  const stableParams: Record<string, string> = {};
  for (const key of sortedKeys) {
    const value = params[key];

    // Sort CSV values for stable query keys
    if (value && value.includes(',')) {
      stableParams[key] = value.split(',').filter(Boolean).sort().join(',');
    } else {
      stableParams[key] = value;
    }
  }
  return JSON.stringify(stableParams);
};
