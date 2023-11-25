interface Base {
  doc?: any;
  docs?: any;
}

export const getClientOnly = async <T extends Base>(params: {
  getStore?: () => Promise<T>,
  setStore?: (data?: T) => Promise<T>,
  getLocal?: () => Promise<T>,
}) => {
  const {
    getStore, setStore, getLocal,
  } = params;

  let data: T | undefined = await getStore?.();

  if (!data?.doc && !data?.docs) {
    data = await getLocal?.();
    setStore?.(data); // non-blocking
  } else {
    getLocal?.().then(setStore); // non-blocking
  }

  return data;
};

export const updateClientOnly = async <T extends Base>(params: {
  updateLocal?: (data?: T) => Promise<T>,
  updateStore?: (data?: T) => Promise<T>,
}) => {
  const { updateLocal, updateStore } = params;

  const data: T | undefined = await updateLocal?.();

  updateStore?.(data); // non-blocking

  return data;
};
