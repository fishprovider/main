import userLogin from '@fishprovider/cross/api/users/login';
import userLogout from '@fishprovider/cross/api/users/logout';
import userUpdateInfo from '@fishprovider/cross/api/users/updateInfo';
import storeUser from '@fishprovider/cross/stores/user';
import type { User } from '@fishprovider/utils/types/User.model';

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
