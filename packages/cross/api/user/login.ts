import type { User } from '@fishprovider/utils/dist/types/User.model';

import { ApiConfig, apiPost } from '~libs/api';

const userLogin = async (
  payload: {
    token: string;
  },
  options?: ApiConfig,
) => {
  const info = await apiPost<User>('/auth/login', payload, options);
  return info;
};

export default userLogin;
