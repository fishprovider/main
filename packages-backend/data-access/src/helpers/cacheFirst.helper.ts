export const getOne = async <T>(params: {
  getCache?: () => Promise<T>,
  setCache?: (data: T) => Promise<T>,
  getDb?: () => Promise<T>,
}) => {
  const { getCache, setCache, getDb } = params;

  let data: T | undefined;

  if (getCache) {
    data = await getCache();
  }

  if (!data && getDb) {
    data = await getDb();

    if (setCache) {
      setCache(data); // non-blocking
    }
  }

  return data;
};

export const getMany = async <T>(params: {
  getCache?: () => Promise<T>,
  setCache?: (data: T) => Promise<T>,
  getDb?: () => Promise<T>,
}) => {
  const { getCache, setCache, getDb } = params;

  let data: T | undefined;

  if (getCache) {
    data = await getCache();
  }

  if (!data && getDb) {
    data = await getDb();

    if (setCache) {
      setCache(data); // non-blocking
    }
  }

  return data;
};

export const updateOne = async <T>(params: {
  updateDb?: () => Promise<T>,
  updateCache?: (data?: T) => Promise<T>,
}) => {
  const { updateDb, updateCache } = params;

  let data: T | undefined;

  if (updateDb) {
    data = await updateDb();
  }

  if (updateCache) {
    updateCache(data); // non-blocking
  }

  return data;
};

export const updateMany = async <T>(params: {
  updateDb?: () => Promise<T>,
  updateCache?: (data?: T) => Promise<T>,
}) => {
  const { updateDb, updateCache } = params;

  let data: T | undefined;

  if (updateDb) {
    data = await updateDb();
  }

  if (updateCache) {
    updateCache(data); // non-blocking
  }

  return data;
};

export const removeOne = async <T>(params: {
  removeDb?: () => Promise<T>,
  removeCache?: () => Promise<T>,
}) => {
  const { removeDb, removeCache } = params;

  let data: T | undefined;

  if (removeDb) {
    data = await removeDb();
  }

  if (removeCache) {
    removeCache(); // non-blocking
  }

  return data;
};
