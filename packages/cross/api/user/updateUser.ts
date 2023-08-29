import type { User } from '@fishprovider/utils/dist/types/User.model';

import { apiPost } from '~libs/api';
import storeUser from '~stores/user';

const updateUser = async (payload: {
  starProvider?: {
    accountId: string;
    enabled: boolean;
  };
}) => {
  const user = await apiPost<Partial<User>>('/v3/user/updateUser', payload);
  const info = {
    ...storeUser.getState().info,
    ...user,
  };
  storeUser.mergeState({ info });
  return info;
};

export default updateUser;
