import localforage from 'localforage';

import { LocalForageDriver } from '.';

export const localGet = async <T>(key: string) => {
  const val = await localforage.getItem<T>(key);
  return val ?? undefined;
};

export const localSet = async <T>(key: string, value: T) => {
  const res = localforage.setItem<T>(key, value);
  return res;
};

export const localRemove = async (key: string) => {
  const res = localforage.removeItem(key);
  return res;
};

export const initLocal = async (params: {
  driver?: LocalForageDriver,
}) => {
  const { driver } = params;
  if (driver) {
    await localforage.defineDriver(driver);
    await localforage.setDriver(driver._driver);
    await localforage.ready().catch(console.error);
  }
};

export const local = localforage;
