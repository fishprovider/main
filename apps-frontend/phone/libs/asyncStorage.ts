import { LocalForageDriver } from '@fishprovider/local';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const localForageDriver: LocalForageDriver = {
  _driver: 'reactNativeAsyncStorage',
  _initStorage: () => undefined,
  _support: true,
  getItem: async (key: string) => {
    const value = await AsyncStorage.getItem(key);
    return value && JSON.parse(value);
  },
  setItem: async <T>(key: string, value: T) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return value;
  },
  removeItem: AsyncStorage.removeItem,
  clear: AsyncStorage.clear,
  length: () => AsyncStorage.getAllKeys().then((keys) => keys.length),
  key: async (keyIndex: number) => {
    const keys = await AsyncStorage.getAllKeys();
    return keys[keyIndex] || '';
  },
  keys: async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    return [...allKeys];
  },
  iterate: async (fn) => {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    values.forEach((value, index) => {
      const [key, val] = value;
      if (val) {
        fn(JSON.parse(val), key, index);
      }
    });
    return null as any;
  },
  dropInstance: async () => AsyncStorage.clear(),
};
