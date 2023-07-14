import type { User } from '@fishprovider/utils/dist/types/User.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeUser from '~stores/user';

const userUpdateInfo = async (
  payload: {
    starProviders?: Record<string, boolean>;
  },
  options?: ApiConfig,
) => {
  const updatedInfo = await apiPost<User>('/users/update', payload, options);
  const info = {
    ...storeUser.getState().info,
    ...updatedInfo,
  };
  storeUser.mergeState({ info });
  return info;
};

export default userUpdateInfo;
