import userLogin from '@fishbot/cross/api/users/login';
import userUpdateInfo from '@fishbot/cross/api/users/updateInfo';
import storeUser from '@fishbot/cross/stores/user';
import type { User } from '@fishbot/utils/types/User.model';
import { useEffect } from 'react';

import { authOnChange } from '~libs/auth';

const useUserAuth = () => {
  const onClientLoggedOut = () => {
    console.info('[user] onClientLoggedOut');
  };

  const onClientLoggedIn = async (userInfo: User, token: string) => {
    console.info('[user] onClientLoggedIn', userInfo);
    await userLogin({ token });
    userUpdateInfo({});
  };

  useEffect(() => {
    authOnChange(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useUserAuth;
