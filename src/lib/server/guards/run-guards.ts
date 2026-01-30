import type { GuardFn, GuardResult } from './types';

export const runGuards = async (...guards: GuardFn[]): Promise<GuardResult> => {
  for (const guard of guards) {
    const result = await guard();
    if (result) return result;
  }
  return null;
};
