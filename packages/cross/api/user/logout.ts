import { ApiConfig, apiPost } from '~libs/api';

const userLogout = async (
  options?: ApiConfig,
) => {
  await apiPost('/auth/logout', {}, options);
};

export default userLogout;
