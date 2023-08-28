import type { User } from '@fishprovider/utils/dist/types/User.model';

import { apiPost } from '~libs/api';
import storeUser from '~stores/user';

const getUser = async (payload: {
  reload?: boolean;
}) => {
  const updatedInfo = await apiPost<User>('/v3/user/getUser', payload);
  const info = {
    ...storeUser.getState().info,
    ...updatedInfo,
  };
  storeUser.mergeState({ info });
  return info;
};

export default getUser;
