import type { User } from '@fishbot/utils/types/User.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeUser from '~stores/user';

const userGetInfo = async (
  payload: {
    reload?: boolean;
  },
  options?: ApiConfig,
) => {
  const updatedInfo = await apiPost<User>('/users/getInfo', payload, options);
  const info = {
    ...storeUser.getState().info,
    ...updatedInfo,
  };
  storeUser.mergeState({ info });
  return info;
};

export default userGetInfo;
