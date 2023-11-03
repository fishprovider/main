export const getLocalFirst = async <T>(params: {
  getLocal?: () => Promise<T>,
  setLocal?: (data: T) => Promise<T>,
  getStore?: () => Promise<T>,
  setStore?: (data: T) => Promise<T>,
  getApi?: () => Promise<T>,
}) => {
  const {
    getLocal, setLocal, getStore, setStore, getApi,
  } = params;

  const setLocalAndStore = (data: T) => {
    setLocal?.(data); // non-blocking
    setStore?.(data); // non-blocking
  };

  let data: T | undefined = await getStore?.();

  if (!data) {
    data = await getLocal?.();
    if (data) setStore?.(data); // non-blocking
  }

  if (!data) {
    data = await getApi?.();
    if (data) setLocalAndStore(data); // non-blocking
  } else {
    getApi?.().then(setLocalAndStore); // non-blocking
  }

  return data;
};

export const updateLocalFirst = async <T>(params: {
  updateApi?: () => Promise<T>,
  updateLocal?: (data: T) => Promise<T>,
  updateStore?: (data: T) => Promise<T>,
}) => {
  const { updateLocal, updateStore, updateApi } = params;

  const data: T | undefined = await updateApi?.();

  if (data) {
    updateLocal?.(data); // non-blocking
    updateStore?.(data); // non-blocking
  }

  return data;
};

export const removeLocalFirst = async <T>(params: {
  removeApi?: () => Promise<T>,
  removeLocal?: () => Promise<T>,
  removeStore?: () => Promise<T>,
}) => {
  const { removeLocal, removeStore, removeApi } = params;

  const data: T | undefined = await removeApi?.();

  removeLocal?.(); // non-blocking
  removeStore?.(); // non-blocking

  return data;
};
