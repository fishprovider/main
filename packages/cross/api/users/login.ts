import type { User } from '@fishprovider/utils/types/User.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeUser from '~stores/user';

const userLogin = async (
  payload: {
    token: string;
  },
  options?: ApiConfig,
) => {
  const info = await apiPost<User>('/auth/login', payload, options);
  storeUser.mergeState({
    isServerLoggedIn: true,
    info,
  });
  return info;
};

export default userLogin;
