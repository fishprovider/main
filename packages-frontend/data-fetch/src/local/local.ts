import localforage from 'localforage';

export const localGet = async <T>(key: string) => {
  const val = await localforage.getItem<T>(key);
  return val ?? undefined;
};

export const localSet = async <T>(key: string, value: T) => {
  const res = localforage.setItem<T>(key, value);
  return res;
};

export const local = localforage;
