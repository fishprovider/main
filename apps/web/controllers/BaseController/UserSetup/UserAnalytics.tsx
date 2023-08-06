import storeUser from '@fishprovider/cross/dist/stores/user';
import { useEffect } from 'react';

import { identifyAnalytics } from '~libs/analytics';
import { isTrack } from '~utils';

function UserAnalytics() {
  const {
    isClientLoggedIn,
    user,
  } = storeUser.useStore((state) => ({
    isClientLoggedIn: state.isClientLoggedIn,
    user: state.info,
  }));

  useEffect(() => {
    if (isClientLoggedIn && user && isTrack) {
      identifyAnalytics(user);
    }
  }, [isClientLoggedIn, user]);

  return null;
}

export default UserAnalytics;
