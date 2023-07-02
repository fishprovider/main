import userLogin from '@fishbot/cross/api/users/login';
import userUpdateInfo from '@fishbot/cross/api/users/updateInfo';
import storeUser from '@fishbot/cross/stores/user';
import promiseCreator from '@fishbot/utils/helpers/promiseCreator';
import type { User } from '@fishbot/utils/types/User.model';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { authOnChange, cacheReadUserToken, refreshUserToken } from '~libs/auth';
import { cacheRead, cacheWrite } from '~libs/cache';
import { redirectPreLoginPage } from '~utils/user';

const cacheKeyUser = 'fp-user';

let raceLogin = false;
const userAuthNew = promiseCreator<{ userInfo: User, token: string }>();

const useUserAuth = () => {
  const router = useRouter();

  const onClientLoggedOut = () => {
    Logger.info('[user] onClientLoggedOut');
    cacheWrite(cacheKeyUser, undefined);
  };

  const onClientLoggedIn = async (userInfo: User, token: string) => {
    Logger.info('[user] onClientLoggedIn', userInfo);
    await userLogin({ token });
    cacheWrite(cacheKeyUser, userInfo);
    userUpdateInfo({});
    redirectPreLoginPage(router.push);
  };

  const loginFromCache = async () => {
    const cacheUserToken = await cacheReadUserToken();
    Logger.debug('[user] cacheUserToken', cacheUserToken);
    if (!cacheUserToken?.createdAt
      || moment().diff(cacheUserToken.createdAt, 'minutes') > 60
    ) return;

    const cacheUser = await cacheRead<User>(cacheKeyUser);
    Logger.debug('[user] cacheUser', cacheUser);
    if (!cacheUser) return;

    if (raceLogin) return;
    raceLogin = true;
    Logger.info('[user] Login from cache');

    onClientLoggedIn(cacheUser, cacheUserToken.token).catch(() => {
      userAuthNew.then((userAuth) => {
        if (!userAuth) return;
        onClientLoggedIn(userAuth.userInfo, userAuth.token);
      });
    });
  };

  const loginFromFirebase = () => {
    const unsub = authOnChange(
      (userInfo, token) => {
        Logger.debug('[user] authOnChange loggedIn', userInfo, token);
        storeUser.mergeState({ isClientLoggedIn: true });
        userAuthNew.resolveExec({ userInfo, token });

        if (raceLogin) return;
        raceLogin = true;
        Logger.info('[user] Login from new');

        onClientLoggedIn(userInfo, token);
      },
      () => {
        Logger.debug('[user] authOnChange loggedOut');
        storeUser.mergeState({ isClientLoggedIn: false });
        userAuthNew.resolveExec();

        onClientLoggedOut();
      },
    );
    return unsub;
  };

  useEffect(() => {
    loginFromCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsub = loginFromFirebase();
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshUserToken();
    }, 1000 * 60 * 15); // 15 mins
    return () => {
      clearInterval(intervalId);
    };
  }, []);
};

export default useUserAuth;
