import userLogin from '@fishprovider/cross/dist/api/users/login';
import userLogout from '@fishprovider/cross/dist/api/users/logout';
import userUpdateInfo from '@fishprovider/cross/dist/api/users/updateInfo';
import storeUser from '@fishprovider/cross/dist/stores/user';
import type { User } from '@fishprovider/utils/dist/types/User.model';

import { cacheWrite } from '~libs/cache';

const preLoginPageKey = 'preLoginPage';
const cacheKeyUser = 'fp-user';

const setPreLoginPage = (redirectUrl: string) => {
  sessionStorage.setItem(preLoginPageKey, decodeURIComponent(redirectUrl));
};

const redirectPreLoginPage = () => {
  const preLoginPage = sessionStorage.getItem(preLoginPageKey);
  if (preLoginPage) {
    Logger.info(`Redirect to preLoginPage: ${preLoginPage}`);
    sessionStorage.removeItem(preLoginPageKey);
    window.location.pathname = preLoginPage;
  }
};

const onClientLoggedOut = async () => {
  Logger.info('[user] onClientLoggedOut');
  storeUser.mergeState({ isClientLoggedIn: false });
  cacheWrite(cacheKeyUser, undefined);
  await userLogout();
};

const onClientLoggedIn = async (
  userInfo: User,
  token: string,
) => {
  Logger.info('[user] onClientLoggedIn', userInfo);
  storeUser.mergeState({ isClientLoggedIn: true });
  await userLogin({ token });
  cacheWrite(cacheKeyUser, userInfo);
  userUpdateInfo({});
  redirectPreLoginPage();
};

export {
  cacheKeyUser,
  onClientLoggedIn,
  onClientLoggedOut,
  setPreLoginPage,
};
