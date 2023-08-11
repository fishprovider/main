import assert from 'assert';
import localforage from 'localforage';

const client = localforage;

const start = async () => {
  console.info('Started local.framework');
  return client;
};

const stop = async () => {
  console.info('Stopped local.framework');
};

const localGet = async <T>(key: string) => {
  const val = await client.getItem<T>(key);
  return val ?? undefined;
};

const localSet = async <T>(key: string, value: T) => {
  const res = client.setItem<T>(key, value);
  return res;
};

const get = async () => {
  assert(client);
  return {
    localGet,
    localSet,
  };
};

export const local = {
  start,
  stop,
  get,
};
