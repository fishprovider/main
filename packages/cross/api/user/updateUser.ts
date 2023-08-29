import type { User } from '@fishprovider/utils/dist/types/User.model';

import { apiPost } from '~libs/api';
import storeUser from '~stores/user';

const updateUser = async (payload: {
  starProvider?: {
    accountId: string;
    enabled: boolean;
  };
}) => {
  const oldInfo = {
    ...storeUser.getState().info,
  };
  const info = {
    ...oldInfo,
    ...payload,
  };
  storeUser.mergeState({ info });
  const res = await apiPost<User>('/v3/user/updateUser', payload);
  if (!res) {
    storeUser.mergeState({ info: oldInfo });
    return oldInfo;
  }
  return info;
};

export default updateUser;
