interface Base {
  doc?: any;
  docs?: any;
}

export const updateClientOnly = async <T extends Base>(params: {
  updateLocal?: (data?: T) => Promise<T>,
  updateStore?: (data?: T) => Promise<T>,
}) => {
  const { updateLocal, updateStore } = params;

  const data: T | undefined = await updateLocal?.();

  updateStore?.(data); // non-blocking

  return data;
};
