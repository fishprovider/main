import { useEffect } from 'react';

import { authOnChange, refreshUserToken } from '~libs/auth';

const useUserAuth = () => {
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
};

export default useUserAuth;
