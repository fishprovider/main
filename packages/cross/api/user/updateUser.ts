import type { Projection } from '@fishprovider/core-new';
import type { User } from '@fishprovider/utils/dist/types/User.model';

import { apiPost } from '~libs/api';
import storeUser from '~stores/user';

const updateUser = async (payload: {
  filter: {
    userId?: string;
    email?: string;
  },
  payload: {
    starProvider?: {
      accountId: string;
      enabled: boolean;
    }
  };
  options: {
    projection?: Projection<User>
  },
} = {
  filter: {},
  payload: {},
  options: {},
}) => {
  const user = await apiPost<Partial<User> | null | undefined>('/v3/user/updateUser', payload);
  const info = {
    ...storeUser.getState().info,
    ...user,
  };
  storeUser.mergeState({ info });
  return info;
};

export default updateUser;
