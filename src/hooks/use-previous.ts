import { useRef } from 'react';

export const usePrevious = <T>(value: T, shouldUpdate: boolean): T => {
  const ref = useRef(value);
  if (shouldUpdate) ref.current = value;
  return ref.current;
};
