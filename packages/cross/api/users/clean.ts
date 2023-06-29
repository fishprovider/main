import { ApiConfig, apiPost } from '~libs/api';

const userClean = async (
  payload: Record<string, any>,
  options?: ApiConfig,
) => {
  const res = await apiPost('/users/clean', payload, options);
  return res;
};

export default userClean;
