import { useEffect } from 'react';

import { authOnChange, loginFromCache, refreshUserToken } from '~libs/auth';

function UserAuth() {
  useEffect(() => {
    loginFromCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsub = authOnChange();
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

  return null;
}

export default UserAuth;
