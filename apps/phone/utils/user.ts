import userLogin from '@fishbot/cross/api/users/login';
import userLogout from '@fishbot/cross/api/users/logout';
import userUpdateInfo from '@fishbot/cross/api/users/updateInfo';
import type { User } from '@fishbot/utils/types/User.model';

const onClientLoggedOut = async () => {
  console.info('[user] onClientLoggedOut');
  await userLogout();
};

const onClientLoggedIn = async (userInfo: User, token: string) => {
  console.info('[user] onClientLoggedIn', userInfo);
  await userLogin({ token });
  userUpdateInfo({});
};

export {
  onClientLoggedIn,
  onClientLoggedOut,
};
