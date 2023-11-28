import { User } from '@fishprovider/core';
import userLogin from '@fishprovider/cross/dist/api/user/login';
import userLogout from '@fishprovider/cross/dist/api/user/logout';

import { updateUserController, updateUserInfoController } from '~controllers/user.controller';

const onClientLoggedOut = async () => {
  Logger.info('[user] onClientLoggedOut');
  updateUserInfoController({ isClientLoggedIn: false });
  await userLogout();
  updateUserInfoController({ isServerLoggedIn: false, activeUser: {} });
};

const onClientLoggedIn = async (userInfo: User, token: string) => {
  Logger.info('[user] onClientLoggedIn', userInfo);
  updateUserInfoController({ isClientLoggedIn: true });
  const activeUser = await userLogin({ token });
  updateUserInfoController({ isServerLoggedIn: true, activeUser });
  updateUserController({ email: userInfo.email }, {});
};

export {
  onClientLoggedIn,
  onClientLoggedOut,
};
