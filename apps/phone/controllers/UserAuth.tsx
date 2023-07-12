import { useEffect } from 'react';

import { authOnChange, refreshUserToken } from '~libs/auth';

function UserAuth() {
  useEffect(() => {
    const unsub = authOnChange();
    return unsub;
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
