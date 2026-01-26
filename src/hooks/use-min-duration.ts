import { useEffect, useRef, useState } from 'react';

/**
 * Ensures a boolean state stays true for at least the specified duration.
 * Useful for preventing loading spinners from flickering when operations complete quickly.
 *
 * @param value - The actual boolean state (e.g., isLoading from a query)
 * @param minDurationMs - Minimum time the returned value stays true (default: 200ms)
 * @returns A boolean that stays true for at least minDurationMs once value becomes true
 */
export const useMinDuration = (
  value: boolean,
  minDurationMs = 200,
): boolean => {
  const [extendedValue, setExtendedValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (value) {
      // Value became true - start tracking
      startTimeRef.current = Date.now();
      setExtendedValue(true);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else if (startTimeRef.current !== null) {
      // Value became false - check if minimum duration has passed
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = minDurationMs - elapsed;

      if (remaining > 0) {
        // Keep showing true for the remaining duration
        timeoutRef.current = setTimeout(() => {
          setExtendedValue(false);
          startTimeRef.current = null;
          timeoutRef.current = null;
        }, remaining);
      } else {
        // Minimum duration already passed
        setExtendedValue(false);
        startTimeRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, minDurationMs]);

  return extendedValue;
};
