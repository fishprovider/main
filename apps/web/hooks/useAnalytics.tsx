import storeUser from '@fishprovider/cross/stores/user';
import { useEffect } from 'react';

import { identifyAnalytics } from '~libs/analytics';

const useAnalytics = () => {
  const {
    isClientLoggedIn,
    user,
  } = storeUser.useStore((state) => ({
    isClientLoggedIn: state.isClientLoggedIn,
    user: state.info,
  }));

  useEffect(() => {
    if (isClientLoggedIn && user) {
      identifyAnalytics(user);
    }
  }, [isClientLoggedIn, user]);
};

export default useAnalytics;
