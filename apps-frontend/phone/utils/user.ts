import userLogin from '@fishprovider/cross/dist/api/user/login';
import userLogout from '@fishprovider/cross/dist/api/user/logout';
import storeUser from '@fishprovider/cross/dist/stores/user';
import type { User } from '@fishprovider/utils/dist/types/User.model';

import { updateUserService } from '~services/user/updateUser.service';

const onClientLoggedOut = async () => {
  Logger.info('[user] onClientLoggedOut');
  storeUser.mergeState({ isClientLoggedIn: false });
  await userLogout();
};

const onClientLoggedIn = async (userInfo: User, token: string) => {
  Logger.info('[user] onClientLoggedIn', userInfo);
  storeUser.mergeState({ isClientLoggedIn: true });
  await userLogin({ token });
  updateUserService({ email: userInfo.email }, {});
};

export {
  onClientLoggedIn,
  onClientLoggedOut,
};
