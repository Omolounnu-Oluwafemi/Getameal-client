'use client';

import { useEffect, useState } from 'react';

/**
 * Debounces a fast-changing value (e.g. search input) so consumers
 * only react after the value has settled for `delayMs`.
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
