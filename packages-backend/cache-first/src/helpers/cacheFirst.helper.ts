interface Base {
  doc?: any;
  docs?: any;
}

export const getCacheFirst = async <T extends Base>(
  params: {
    getCache?: () => Promise<T>,
  },
) => {
  const { getCache } = params;

  const data: T | undefined = await getCache?.();
  return data;
};

export const getAndSetCacheFirst = async <T extends Base>(
  params: {
    getCache?: () => Promise<T>,
    setCache?: (data?: T) => Promise<T>,
    getDb?: () => Promise<T>,
  },
) => {
  const { getCache, setCache, getDb } = params;
  let data: T | undefined = await getCache?.();

  const isEmpty = !data?.doc && !data?.docs;
  if (isEmpty) {
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
