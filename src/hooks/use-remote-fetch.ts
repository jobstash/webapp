import { useEffect, useState } from 'react';

interface Options<TResponse, TData> {
  transform?: (data: TResponse) => TData;
  fetchOptions?: RequestInit;
  cacheTtl?: number;
}

const cache = new Map<string, { data: unknown; timestamp: number }>();
const DEFAULT_CACHE_TTL = 3600 * 1000;

export const useRemoteFetch = <TResponse, TData = TResponse>(
  url: string | null,
  options?: Options<TResponse, TData>,
) => {
  const {
    transform,
    fetchOptions,
    cacheTtl = DEFAULT_CACHE_TTL,
  } = options ?? {};
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!url) {
      setData(null);
      return;
    }

    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < cacheTtl) {
      const result = transform
        ? transform(cached.data as TResponse)
        : (cached.data as TData);
      setData(result);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetch(url, { ...fetchOptions, signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        cache.set(url, { data: json, timestamp: Date.now() });
        setData(transform ? transform(json) : json);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [url, transform, fetchOptions, cacheTtl]);

  return { data, isLoading };
};
