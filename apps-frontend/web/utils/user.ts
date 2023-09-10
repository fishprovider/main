import userLogin from '@fishprovider/cross/dist/api/user/login';
import userLogout from '@fishprovider/cross/dist/api/user/logout';
import updateUser from '@fishprovider/cross/dist/api/user/updateUser';
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
  updateUser();
  redirectPreLoginPage();
};

export {
  cacheKeyUser,
  onClientLoggedIn,
  onClientLoggedOut,
  setPreLoginPage,
};
