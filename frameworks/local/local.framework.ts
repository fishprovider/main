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

async function localGet<T>(key: string) {
  const val = await client.getItem<T>(key);
  return val ?? undefined;
}

async function localSet<T>(key: string, value: T) {
  return client.setItem<T>(key, value);
}

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
