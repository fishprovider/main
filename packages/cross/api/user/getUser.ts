import type { User } from '@fishprovider/utils/dist/types/User.model';

import { apiGet } from '~libs/api';
import storeUser from '~stores/user';

const getUser = async (payload: {
  userId?: string;
  email?: string;
} = {}) => {
  const user = await apiGet<Partial<User> | null | undefined>('/v3/user/getUser', payload);
  const info = {
    ...storeUser.getState().info,
    ...user,
  };
  storeUser.mergeState({ info });
  return info;
};

export default getUser;
