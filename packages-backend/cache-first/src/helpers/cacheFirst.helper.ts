import moment from 'moment';

interface Base {
  doc?: any;
  docs?: any;
  at?: Date;
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
    ttlSec?: number,
  },
) => {
  const {
    getCache, setCache, getDb, ttlSec,
  } = params;
  let data: T | undefined = await getCache?.();

  const isEmpty = !data?.doc && !data?.docs;
  const isExpired = ttlSec && data?.at && moment().diff(moment(data.at), 'seconds') > ttlSec;
  if (isEmpty || isExpired) {
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
