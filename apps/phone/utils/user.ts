import userLogin from '@fishprovider/cross/dist/api/users/login';
import userLogout from '@fishprovider/cross/dist/api/users/logout';
import userUpdateInfo from '@fishprovider/cross/dist/api/users/updateInfo';
import storeUser from '@fishprovider/cross/dist/stores/user';
import type { User } from '@fishprovider/utils/dist/types/User.model';

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
