import userLogin from '@fishbot/cross/api/users/login';
import userLogout from '@fishbot/cross/api/users/logout';
import userUpdateInfo from '@fishbot/cross/api/users/updateInfo';
import storeUser from '@fishbot/cross/stores/user';
import type { User } from '@fishbot/utils/types/User.model';

const onClientLoggedOut = async () => {
  console.info('[user] onClientLoggedOut');
  storeUser.mergeState({ isClientLoggedIn: false });
  await userLogout();
};

const onClientLoggedIn = async (userInfo: User, token: string) => {
  console.info('[user] onClientLoggedIn', userInfo);
  storeUser.mergeState({ isClientLoggedIn: true });
  await userLogin({ token });
  userUpdateInfo({});
};

export {
  onClientLoggedIn,
  onClientLoggedOut,
};
