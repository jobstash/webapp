import { useEffect, useRef, useState } from 'react';

export const useMinDuration = (
  value: boolean,
  minDurationMs = 200,
): boolean => {
  const [extendedValue, setExtendedValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (value) {
      startTimeRef.current = Date.now();
      setExtendedValue(true);
      return;
    }

    if (startTimeRef.current === null) return;

    const elapsed = Date.now() - startTimeRef.current;
    const remaining = minDurationMs - elapsed;

    if (remaining > 0) {
      timeoutRef.current = setTimeout(() => {
        setExtendedValue(false);
        startTimeRef.current = null;
        timeoutRef.current = null;
      }, remaining);
    } else {
      setExtendedValue(false);
      startTimeRef.current = null;
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, minDurationMs]);

  return value || extendedValue;
};
