interface Base {
  doc?: any;
  docs?: any;
}

export const getLocalFirst = async <T extends Base>(params: {
  getStore?: () => Promise<T>,
  setStore?: (data?: T) => Promise<T>,
  getLocal?: () => Promise<T>,
  setLocal?: (data?: T) => Promise<T>,
  getApi?: () => Promise<T>,
}) => {
  const {
    getStore, setStore, getLocal, setLocal, getApi,
  } = params;

  const setLocalAndStore = (data?: T) => {
    setLocal?.(data); // non-blocking
    setStore?.(data); // non-blocking
  };

  let data: T | undefined = await getStore?.();

  if (!data?.doc && !data?.docs) {
    data = await getLocal?.();
    setStore?.(data); // non-blocking
  }

  if (!data?.doc && !data?.docs) {
    data = await getApi?.();
    setLocalAndStore(data); // non-blocking
  } else {
    getApi?.().then(setLocalAndStore); // non-blocking
  }

  return data;
};

export const updateLocalFirst = async <T extends Base>(params: {
  updateApi?: () => Promise<T>,
  updateLocal?: (data?: T) => Promise<T>,
  updateStore?: (data?: T) => Promise<T>,
}) => {
  const { updateLocal, updateStore, updateApi } = params;

  const data: T | undefined = await updateApi?.();

  updateLocal?.(data); // non-blocking
  updateStore?.(data); // non-blocking

  return data;
};
