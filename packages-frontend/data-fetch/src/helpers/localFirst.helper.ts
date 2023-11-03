export const getLocalFirst = async <T>(params: {
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

  if (!data) {
    data = await getLocal?.();
    if (data) {
      setStore?.(data); // non-blocking
    }
  }

  if (!data) {
    data = await getApi?.();
    setLocalAndStore(data); // non-blocking
  } else {
    getApi?.().then(setLocalAndStore); // non-blocking
  }

  return data;
};

export const updateLocalFirst = async <T>(params: {
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
