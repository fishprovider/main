interface Base {
  doc?: any;
  docs?: any;
}

export const getLocalFirst = async <T extends Base>(params: {
  getLocal?: () => Promise<T>,
  setLocal?: (data?: T) => Promise<T>,
  getApi?: () => Promise<T>,
}) => {
  const {
    getLocal, setLocal, getApi,
  } = params;

  let data: T | undefined = await getLocal?.();

  if (!data?.doc && !data?.docs) {
    data = await getApi?.();
    setLocal?.(data); // non-blocking
  } else {
    getApi?.().then(setLocal); // non-blocking
  }

  return data;
};

export const updateLocalFirst = async <T extends Base>(params: {
  updateApi?: () => Promise<T>,
  updateLocal?: (data?: T) => Promise<T>,
}) => {
  const { updateLocal, updateApi } = params;

  const data: T | undefined = await updateApi?.();

  updateLocal?.(data); // non-blocking

  return data;
};
