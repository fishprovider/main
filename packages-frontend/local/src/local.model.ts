interface LocalForageDbInstanceOptions {
  name?: string;

  storeName?: string;
}

interface LocalForageOptions extends LocalForageDbInstanceOptions {
  driver?: string | string[];

  size?: number;

  version?: number;

  description?: string;
}

interface LocalForageDbMethodsCore {
  getItem<T>(key: string, callback?: (err: any, value: T | null) => void): Promise<T | null>;

  setItem<T>(key: string, value: T, callback?: (err: any, value: T) => void): Promise<T>;

  removeItem(key: string, callback?: (err: any) => void): Promise<void>;

  clear(callback?: (err: any) => void): Promise<void>;

  length(callback?: (err: any, numberOfKeys: number) => void): Promise<number>;

  key(keyIndex: number, callback?: (err: any, key: string) => void): Promise<string>;

  keys(callback?: (err: any, keys: string[]) => void): Promise<string[]>;

  iterate<T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U,
    callback?: (err: any, result: U) => void): Promise<U>;
}

interface LocalForageDropInstanceFn {
  (dbInstanceOptions?: LocalForageDbInstanceOptions, callback?: (err: any) => void): Promise<void>;
}

interface LocalForageDriverMethodsOptional {
  dropInstance?: LocalForageDropInstanceFn;
}

interface LocalForageDriverDbMethods extends
  LocalForageDbMethodsCore, LocalForageDriverMethodsOptional {}

interface LocalForageDriverSupportFunc {
  (): Promise<boolean>;
}

export interface LocalForageDriver extends LocalForageDriverDbMethods {
  _driver: string;

  _initStorage(options: LocalForageOptions): void;

  _support?: boolean | LocalForageDriverSupportFunc;
}
