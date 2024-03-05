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
    expireSec?: number,
    reloadSec?: number,
  },
) => {
  const {
    getCache, setCache, getDb, expireSec, reloadSec,
  } = params;
  let data: T | undefined = await getCache?.();

  const checkSetCache = () => {
    if (!data) return true;

    const { doc, docs, at } = data;

    const isEmpty = !doc && !docs;
    if (isEmpty) return true;

    if (!at) return false;

    const now = moment();
    const setAt = moment(at);
    const diffSec = now.diff(setAt, 'seconds');

    const isExpired = expireSec && diffSec > expireSec;
    if (isExpired) return true;

    const needReload = reloadSec && diffSec > reloadSec;
    if (needReload) return true;

    return false;
  };

  if (checkSetCache()) {
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
