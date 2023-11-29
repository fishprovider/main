import { CacheFirstOptions } from '@fishprovider/core-backend';

interface Base {
  doc?: any;
  docs?: any;
}

export const getCacheFirst = async <T extends Base>(
  params: {
    getCache?: () => Promise<T>,
    setCache?: (data?: T) => Promise<T>,
    getDb?: () => Promise<T>,
  },
  options?: CacheFirstOptions,
) => {
  const { getCache, setCache, getDb } = params;
  const { initializeCache } = options || {};

  let data: T | undefined = await getCache?.();

  const isCacheEmpty = !data?.doc && !data?.docs;
  if (initializeCache && isCacheEmpty) {
    data = await getDb?.();
    setCache?.(data); // non-blocking
  }

  return data;
};

export const updateCacheFirst = async <T extends Base>(params: {
  updateDb?: () => Promise<T>,
  updateCache?: (data?: T) => Promise<T>,
}) => {
  const { updateDb, updateCache } = params;

  const data: T | undefined = await updateDb?.();

  updateCache?.(data); // non-blocking

  return data;
};
