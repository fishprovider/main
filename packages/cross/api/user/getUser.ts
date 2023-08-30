import type { Projection } from '@fishprovider/core-new';
import type { User } from '@fishprovider/utils/dist/types/User.model';

import { apiGet } from '~libs/api';
import storeUser from '~stores/user';

const getUser = async (payload: {
  filter: {
    userId?: string;
    email?: string;
  },
  options: {
    projection?: Projection<User>
  },
} = {
  filter: {},
  options: {},
}) => {
  const user = await apiGet<Partial<User> | null | undefined>('/v3/user/getUser', payload);
  const info = {
    ...storeUser.getState().info,
    ...user,
  };
  storeUser.mergeState({ info });
  return info;
};

export default getUser;
