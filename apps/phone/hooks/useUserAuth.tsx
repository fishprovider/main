import storeUser from '@fishbot/cross/stores/user';
import { useEffect } from 'react';

import { authOnChange, refreshUserToken } from '~libs/auth';
import { onClientLoggedIn, onClientLoggedOut } from '~utils/user';

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

const useUserAuth = () => {
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
