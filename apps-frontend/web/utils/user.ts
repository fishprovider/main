import userLogin from '@fishprovider/cross/dist/api/user/login';
import userLogout from '@fishprovider/cross/dist/api/user/logout';
import type { User } from '@fishprovider/utils/dist/types/User.model';

import { updateUserController, updateUserInfoController } from '~controllers/user.controller';
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
  updateUserInfoController({ isClientLoggedIn: false });
  cacheWrite(cacheKeyUser, undefined);
  await userLogout();
  updateUserInfoController({ isServerLoggedIn: false, activeUser: {} });
};

const onClientLoggedIn = async (
  userInfo: User,
  token: string,
) => {
  Logger.info('[user] onClientLoggedIn', userInfo);
  updateUserInfoController({ isClientLoggedIn: true });
  await userLogin({ token });
  updateUserInfoController({ isServerLoggedIn: true });
  cacheWrite(cacheKeyUser, userInfo);
  updateUserController({ email: userInfo.email }, {});
  redirectPreLoginPage();
};

export {
  cacheKeyUser,
  onClientLoggedIn,
  onClientLoggedOut,
  setPreLoginPage,
};
