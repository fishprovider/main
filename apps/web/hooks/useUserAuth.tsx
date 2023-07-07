import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { authOnChange, loginFromCache, refreshUserToken } from '~libs/auth';

const useUserAuth = () => {
  const router = useRouter();

  useEffect(() => {
    loginFromCache(router.push);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsub = authOnChange(router.push);
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
