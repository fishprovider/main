import userLogin from '@fishbot/cross/api/users/login';
import userUpdateInfo from '@fishbot/cross/api/users/updateInfo';
import storeUser from '@fishbot/cross/stores/user';
import type { User } from '@fishbot/utils/types/User.model';
import { useEffect } from 'react';

import { authOnChange, refreshUserToken } from '~libs/auth';

const useUserAuth = () => {
  const onClientLoggedOut = () => {
    console.info('[user] onClientLoggedOut');
  };

  const onClientLoggedIn = async (userInfo: User, token: string) => {
    console.info('[user] onClientLoggedIn', userInfo);
    await userLogin({ token });
    userUpdateInfo({});
  };

  const loginFromFirebase = () => {
    const unsub = authOnChange(
      (userInfo, token) => {
        console.debug('[user] authOnChange loggedIn', userInfo, token);
        storeUser.mergeState({ isClientLoggedIn: true });
        onClientLoggedIn(userInfo, token);
      },
      () => {
        console.debug('[user] authOnChange loggedOut');
        storeUser.mergeState({ isClientLoggedIn: false });
        onClientLoggedOut();
      },
    );
    return unsub;
  };

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
